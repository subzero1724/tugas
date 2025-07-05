import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/supabase-db"

export async function GET() {
  try {
    const invoices = await supabaseDb.getInvoices()

    return NextResponse.json({
      success: true,
      data: invoices,
    })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch invoices",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received invoice data:", body)

    // Validate required fields
    if (!body.invoice_number || !body.supplier_code || !body.invoice_date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: invoice_number, supplier_code, or invoice_date",
        },
        { status: 400 },
      )
    }

    // Calculate total amount
    const totalAmount =
      body.items?.reduce((sum: number, item: any) => {
        return sum + item.quantity * item.unit_price
      }, 0) || 0

    // Prepare invoice data
    const invoiceData = {
      invoice_number: body.invoice_number,
      supplier_code: body.supplier_code,
      invoice_date: body.invoice_date,
      total_amount: totalAmount,
      status: body.status || "pending",
      notes: body.notes || "",
      created_by: body.created_by || "system",
      items: body.items || [],
    }

    console.log("Processed invoice data:", invoiceData)

    const newInvoice = await supabaseDb.createInvoice(invoiceData)

    return NextResponse.json({
      success: true,
      data: newInvoice,
      message: "Invoice created successfully",
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create invoice",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
