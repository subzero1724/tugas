import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function POST() {
  try {
    console.log("Starting database setup...")

    // Create suppliers table
    const { error: suppliersError } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS suppliers (
          id SERIAL PRIMARY KEY,
          supplier_code VARCHAR(20) UNIQUE NOT NULL,
          supplier_name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(255),
          phone VARCHAR(50),
          email VARCHAR(255),
          address TEXT,
          city VARCHAR(100),
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    if (suppliersError) {
      console.error("Error creating suppliers table:", suppliersError)
    }

    // Create products table
    const { error: productsError } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          product_code VARCHAR(20) UNIQUE NOT NULL,
          product_name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          unit VARCHAR(20) NOT NULL,
          unit_price DECIMAL(15,2) DEFAULT 0,
          stock_quantity INTEGER DEFAULT 0,
          supplier_code VARCHAR(20),
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    if (productsError) {
      console.error("Error creating products table:", productsError)
    }

    // Create invoices table
    const { error: invoicesError } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS invoices (
          id SERIAL PRIMARY KEY,
          invoice_number VARCHAR(50) UNIQUE NOT NULL,
          supplier_code VARCHAR(20) NOT NULL,
          invoice_date DATE NOT NULL,
          total_amount DECIMAL(15,2) DEFAULT 0,
          status VARCHAR(20) DEFAULT 'pending',
          payment_status VARCHAR(20) DEFAULT 'unpaid',
          notes TEXT,
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    if (invoicesError) {
      console.error("Error creating invoices table:", invoicesError)
    }

    // Create invoice_items table
    const { error: itemsError } = await supabaseAdmin.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS invoice_items (
          id SERIAL PRIMARY KEY,
          invoice_id INTEGER NOT NULL,
          product_code VARCHAR(20) NOT NULL,
          product_name VARCHAR(255),
          quantity INTEGER NOT NULL,
          unit_price DECIMAL(15,2) NOT NULL,
          line_total DECIMAL(15,2) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    if (itemsError) {
      console.error("Error creating invoice_items table:", itemsError)
    }

    // Insert sample suppliers
    const { error: sampleSuppliersError } = await supabaseAdmin.from("suppliers").upsert(
      [
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
      ],
      { onConflict: "supplier_code" },
    )

    if (sampleSuppliersError) {
      console.error("Error inserting sample suppliers:", sampleSuppliersError)
    }

    // Insert sample products
    const { error: sampleProductsError } = await supabaseAdmin.from("products").upsert(
      [
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
      ],
      { onConflict: "product_code" },
    )

    if (sampleProductsError) {
      console.error("Error inserting sample products:", sampleProductsError)
    }

    // Insert sample invoices
    const { data: sampleInvoice, error: sampleInvoiceError } = await supabaseAdmin
      .from("invoices")
      .upsert(
        [
          {
            invoice_number: "INV-2024-001",
            supplier_code: "SUP001",
            invoice_date: "2024-01-15",
            total_amount: 17000000,
            status: "approved",
            notes: "Pembelian laptop dan mouse untuk kantor",
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
        ],
        { onConflict: "invoice_number" },
      )
      .select()

    if (sampleInvoiceError) {
      console.error("Error inserting sample invoices:", sampleInvoiceError)
    }

    // Insert sample invoice items
    if (sampleInvoice && sampleInvoice.length > 0) {
      const { error: sampleItemsError } = await supabaseAdmin.from("invoice_items").upsert([
        {
          invoice_id: sampleInvoice[0].id,
          product_code: "PRD001",
          product_name: "Laptop Dell Inspiron",
          quantity: 2,
          unit_price: 8500000,
          line_total: 17000000,
        },
        {
          invoice_id: sampleInvoice[1].id,
          product_code: "PRD002",
          product_name: "Mouse Wireless",
          quantity: 10,
          unit_price: 150000,
          line_total: 1500000,
        },
      ])

      if (sampleItemsError) {
        console.error("Error inserting sample invoice items:", sampleItemsError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
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
