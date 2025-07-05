import { NextResponse } from "next/server"
import { getProducts } from "@/lib/supabase-db"

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
