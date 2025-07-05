import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db-connection-hosted"

export async function POST() {
  try {
    console.log("🚀 Starting database setup...")

    const success = await initializeDatabase()

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Database setup completed successfully",
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Database setup failed",
          message: "Please check your database configuration and try again",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to setup database",
    endpoints: {
      setup: "POST /api/setup-database",
      test: "GET /api/test-db",
    },
  })
}
