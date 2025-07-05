import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin.from("suppliers").select("count", { count: "exact", head: true })

    if (error) {
      return NextResponse.json({
        success: false,
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      connected: true,
      message: "Supabase connection successful",
      timestamp: new Date().toISOString(),
      suppliersCount: data || 0,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    })
  }
}
