import { NextResponse } from "next/server"
import { getSuppliers } from "@/lib/supabase-db"

export async function GET() {
  try {
    const suppliers = await getSuppliers()
    return NextResponse.json({ success: true, data: suppliers })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
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
