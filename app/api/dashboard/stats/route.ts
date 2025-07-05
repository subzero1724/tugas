import { type NextRequest, NextResponse } from "next/server"
import { getDashboardStats, createInvoice } from "@/lib/supabase-db"
import type { CreateInvoiceRequest } from "@/lib/supabase-db"

export async function GET() {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard statistics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateInvoiceRequest = await request.json()

    // --- Validasi yang Ditingkatkan ---
    if (!body.invoice_number) {
      return NextResponse.json({ success: false, error: "Nomor faktur wajib diisi." }, { status: 400 })
    }
    if (!body.supplier_code) {
      return NextResponse.json({ success: false, error: "Kode supplier wajib diisi." }, { status: 400 })
    }
    if (!body.invoice_date) {
      return NextResponse.json({ success: false, error: "Tanggal faktur wajib diisi." }, { status: 400 })
    }
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Faktur harus memiliki setidaknya satu item barang." },
        { status: 400 },
      )
    }

    for (const item of body.items) {
      if (!item.product_code || !item.product_name || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { success: false, error: `Data item tidak lengkap: ${item.product_name || "item tanpa nama"}.` },
          { status: 400 },
        )
      }
      if (item.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: `Jumlah (qty) untuk item ${item.product_name} harus lebih dari 0.` },
          { status: 400 },
        )
      }
      if (item.unit_price <= 0) {
        return NextResponse.json(
          { success: false, error: `Harga untuk item ${item.product_name} harus lebih dari 0.` },
          { status: 400 },
        )
      }
    }
    // --- Akhir Validasi ---

    const invoice = await createInvoice(body)

    return NextResponse.json({
      success: true,
      data: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
      },
      message: "Faktur berhasil dibuat!",
    })
  } catch (error) {
    console.error("Error creating invoice:", error)

    // Handle duplikat nomor faktur dengan lebih baik
    if (
      error instanceof Error &&
      (error.message.includes("duplicate key") || error.message.includes("Unique constraint failed"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Nomor faktur '${(await request.clone().json()).invoice_number}' sudah ada.`,
        },
        { status: 409 }, // 409 Conflict lebih sesuai
      )
    }

    // Handle error spesifik dari database logic
    if (error instanceof Error && error.message.startsWith("Supplier")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 404 })
    }

    return NextResponse.json(
      {
        success: false,
        error: "Gagal membuat faktur",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
