import { type NextRequest, NextResponse } from "next/server"
import { supabaseDb } from "@/lib/supabase-db"

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

    const invoice = await supabaseDb.getInvoiceById(id)

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: invoice,
    })
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch invoice details",
      },
      { status: 500 },
    )
  }
}
