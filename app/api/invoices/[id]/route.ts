import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabase-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid invoice ID",
        },
        { status: 400 },
      )
    }

    const invoice = await db.getInvoiceById(id)

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 },
      )
    }

    const response = {
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      total_amount: Number(invoice.total_amount),
      status: invoice.status,
      notes: invoice.notes,
      supplier_code: invoice.supplier_code,
      supplier_name: invoice.supplier_name,
      items:
        invoice.items?.map((item) => ({
          id: item.id,
          product_code: item.product_code,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          line_total: Number(item.line_total),
          notes: item.notes,
        })) || [],
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
    }

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch invoice details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
