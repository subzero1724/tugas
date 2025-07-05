import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function POST() {
  try {
    console.log("Starting database setup...")

    // Create suppliers table and data
    const suppliersData = [
      {
        supplier_code: "SUP001",
        supplier_name: "PT Maju Jaya",
        contact_person: "Budi Santoso",
        phone: "021-12345678",
        email: "budi@majujaya.com",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta",
        status: "active",
      },
      {
        supplier_code: "SUP002",
        supplier_name: "CV Berkah Mandiri",
        contact_person: "Siti Nurhaliza",
        phone: "021-87654321",
        email: "siti@berkahmandiri.com",
        address: "Jl. Thamrin No. 456",
        city: "Jakarta",
        status: "active",
      },
    ]

    const { error: suppliersError } = await supabaseAdmin
      .from("suppliers")
      .upsert(suppliersData, { onConflict: "supplier_code" })

    if (suppliersError) {
      console.error("Error inserting suppliers:", suppliersError)
      throw suppliersError
    }

    // Create products table and data
    const productsData = [
      {
        product_code: "PRD001",
        product_name: "Laptop Dell Inspiron",
        description: "Laptop untuk kantor",
        category: "Electronics",
        unit: "pcs",
        unit_price: 8500000,
        stock_quantity: 10,
        supplier_code: "SUP001",
        status: "active",
      },
      {
        product_code: "PRD002",
        product_name: "Mouse Wireless",
        description: "Mouse wireless untuk komputer",
        category: "Electronics",
        unit: "pcs",
        unit_price: 150000,
        stock_quantity: 50,
        supplier_code: "SUP001",
        status: "active",
      },
    ]

    const { error: productsError } = await supabaseAdmin
      .from("products")
      .upsert(productsData, { onConflict: "product_code" })

    if (productsError) {
      console.error("Error inserting products:", productsError)
      throw productsError
    }

    // Create sample invoices
    const invoicesData = [
      {
        invoice_number: "INV-2024-001",
        supplier_code: "SUP001",
        invoice_date: "2024-01-15",
        total_amount: 17000000,
        status: "approved",
        notes: "Pembelian laptop untuk kantor",
        created_by: "admin",
      },
      {
        invoice_number: "INV-2024-002",
        supplier_code: "SUP002",
        invoice_date: "2024-01-20",
        total_amount: 6500000,
        status: "pending",
        notes: "Pembelian peralatan kantor",
        created_by: "admin",
      },
    ]

    const { data: invoices, error: invoicesError } = await supabaseAdmin
      .from("invoices")
      .upsert(invoicesData, { onConflict: "invoice_number" })
      .select()

    if (invoicesError) {
      console.error("Error inserting invoices:", invoicesError)
      throw invoicesError
    }

    // Create sample invoice items
    if (invoices && invoices.length > 0) {
      const itemsData = [
        {
          invoice_id: invoices[0].id,
          product_code: "PRD001",
          product_name: "Laptop Dell Inspiron",
          quantity: 2,
          unit_price: 8500000,
          line_total: 17000000,
        },
        {
          invoice_id: invoices[1].id,
          product_code: "PRD002",
          product_name: "Mouse Wireless",
          quantity: 10,
          unit_price: 150000,
          line_total: 1500000,
        },
      ]

      const { error: itemsError } = await supabaseAdmin
        .from("invoice_items")
        .upsert(itemsData, { onConflict: "invoice_id,product_code" })

      if (itemsError) {
        console.error("Error inserting invoice items:", itemsError)
        throw itemsError
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
      data: {
        suppliers: suppliersData.length,
        products: productsData.length,
        invoices: invoicesData.length,
      },
    })
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
