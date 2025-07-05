import { NextResponse } from "next/server"
import { getSuppliers } from "@/lib/supabase-db"

export async function GET() {
  try {
    console.log("API: Fetching suppliers...")
    const suppliers = await getSuppliers()
    console.log("API: Suppliers fetched:", suppliers.length)

    return NextResponse.json({
      success: true,
      data: suppliers,
    })
  } catch (error) {
    console.error("API: Error fetching suppliers:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch suppliers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
