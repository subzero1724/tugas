import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase-client"

export async function GET() {
  try {
    const result = await testSupabaseConnection()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase connection failed",
          details: result.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection verified successfully",
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
