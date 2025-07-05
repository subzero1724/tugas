import { type NextRequest, NextResponse } from "next/server"
import { getInvoiceById } from "@/lib/supabase-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ success: false, error: "Invalid invoice ID" }, { status: 400 })
    }

    const invoice = await getInvoiceById(id)

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 })
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
        error: "Failed to fetch invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
