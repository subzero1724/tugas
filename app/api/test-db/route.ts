import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin.from("suppliers").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Database connection error:", error)
      return NextResponse.json({
        success: false,
        error: "Database connection failed",
        details: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
