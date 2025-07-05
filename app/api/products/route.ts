import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { Product } from "@/lib/types"

export async function GET() {
  try {
    const products = (await executeQuery(`
      SELECT id, product_code, product_name, category, unit, base_price,
             description, status, created_at, updated_at
      FROM products 
      WHERE status = 'active'
      ORDER BY product_name
    `)) as Product[]

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_code, product_name, category, unit, base_price, description } = body

    const result = await executeQuery(
      `
      INSERT INTO products (product_code, product_name, category, unit, base_price, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [product_code, product_name, category || null, unit || "pcs", base_price || 0, description || null],
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
