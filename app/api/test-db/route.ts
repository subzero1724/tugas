import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const { data, error } = await supabaseAdmin.from("suppliers").select("count(*)").single()

    if (error) {
      console.error("Database connection error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: data,
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
