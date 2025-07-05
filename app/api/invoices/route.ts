import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/supabase-db"
import type { CreateInvoiceRequest } from "@/lib/supabase-db"

export async function GET() {
  try {
    const invoices = await db.getInvoices()

    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      total_amount: Number(invoice.total_amount),
      status: invoice.status,
      supplier_code: invoice.supplier_code,
      supplier_name: invoice.supplier_name,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
    }))

    return NextResponse.json({
      success: true,
      data: formattedInvoices,
      count: formattedInvoices.length,
    })
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
    const body: CreateInvoiceRequest = await request.json()

    // Validate required fields
    if (!body.invoice_number || !body.supplier_code || !body.invoice_date || !body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const invoice = await db.createInvoice(body)

    return NextResponse.json({
      success: true,
      data: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
      },
      message: "Invoice created successfully",
    })
  } catch (error) {
    console.error("Error creating invoice:", error)

    // Handle duplicate invoice number
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice number already exists",
        },
        { status: 400 },
      )
    }

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
