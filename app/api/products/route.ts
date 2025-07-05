import { NextResponse } from "next/server"
import { getProducts } from "@/lib/supabase-db"

export async function GET() {
  try {
    console.log("API: Fetching products...")
    const products = await getProducts()
    console.log("API: Products fetched:", products.length)

    return NextResponse.json({
      success: true,
      data: products,
    })
  } catch (error) {
    console.error("API: Error fetching products:", error)
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
