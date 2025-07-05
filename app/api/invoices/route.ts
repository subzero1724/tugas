import { type NextRequest, NextResponse } from "next/server"
import { getInvoices, createInvoice, type CreateInvoiceData } from "@/lib/supabase-db"

export async function GET() {
  try {
    const invoices = await getInvoices()
    return NextResponse.json({ success: true, data: invoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch invoices",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.supplier_code || !body.invoice_number || !body.invoice_date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: supplier_code, invoice_number, invoice_date",
        },
        { status: 400 },
      )
    }

    // Validate items
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one invoice item is required",
        },
        { status: 400 },
      )
    }

    // Calculate total amount from items
    const totalAmount = body.items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unit_price
    }, 0)

    const invoiceData: CreateInvoiceData = {
      supplier_code: body.supplier_code,
      invoice_number: body.invoice_number,
      invoice_date: body.invoice_date,
      total_amount: totalAmount,
      status: body.status || "pending",
      notes: body.notes || "",
      items: body.items.map((item: any) => ({
        product_code: item.product_code,
        quantity: Number.parseInt(item.quantity),
        unit_price: Number.parseFloat(item.unit_price),
        line_total: Number.parseInt(item.quantity) * Number.parseFloat(item.unit_price),
      })),
    }

    const invoice = await createInvoice(invoiceData)

    return NextResponse.json({
      success: true,
      data: invoice,
      message: "Invoice created successfully",
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
