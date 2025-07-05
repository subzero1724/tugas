import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"
import type { Supplier } from "@/lib/types"

export async function GET() {
  try {
    const suppliers = (await executeQuery(`
      SELECT id, supplier_code, supplier_name, address, phone, email, 
             contact_person, status, created_at, updated_at
      FROM suppliers 
      WHERE status = 'active'
      ORDER BY supplier_name
    `)) as Supplier[]

    return NextResponse.json({ success: true, data: suppliers })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { supplier_code, supplier_name, address, phone, email, contact_person } = body

    const result = await executeQuery(
      `
      INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [supplier_code, supplier_name, address || null, phone || null, email || null, contact_person || null],
    )

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ success: false, error: "Failed to create supplier" }, { status: 500 })
  }
}
