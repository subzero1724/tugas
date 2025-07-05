import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-client"

export async function POST() {
  try {
    console.log("Setting up Supabase database...")

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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (supplier_code) REFERENCES suppliers(supplier_code)
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
          total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
          status VARCHAR(20) DEFAULT 'pending',
          payment_status VARCHAR(20) DEFAULT 'unpaid',
          notes TEXT,
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (supplier_code) REFERENCES suppliers(supplier_code)
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
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
          FOREIGN KEY (product_code) REFERENCES products(product_code)
        );
      `,
    })

    if (itemsError) {
      console.error("Error creating invoice_items table:", itemsError)
    }

    // Insert sample data
    await insertSampleData()

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function insertSampleData() {
  try {
    // Insert sample suppliers
    const { error: suppliersError } = await supabaseAdmin.from("suppliers").upsert(
      [
        {
          supplier_code: "S01",
          supplier_name: "PT Hitachi Indonesia",
          contact_person: "John Doe",
          phone: "021-1234567",
          email: "contact@hitachi.co.id",
          address: "Jl. Sudirman No. 123",
          city: "Jakarta",
          status: "active",
        },
        {
          supplier_code: "G01",
          supplier_name: "Global Nusantara",
          contact_person: "Jane Smith",
          phone: "021-7654321",
          email: "info@globalnusantara.com",
          address: "Jl. Thamrin No. 456",
          city: "Jakarta",
          status: "active",
        },
      ],
      { onConflict: "supplier_code" },
    )

    if (suppliersError) {
      console.error("Error inserting suppliers:", suppliersError)
    }

    // Insert sample products
    const { error: productsError } = await supabaseAdmin.from("products").upsert(
      [
        {
          product_code: "RC001",
          product_name: "RICE COOKER CC3",
          description: "Rice cooker 1.8L capacity",
          category: "Electronics",
          unit: "pcs",
          unit_price: 1500000,
          stock_quantity: 50,
          supplier_code: "S01",
          status: "active",
        },
        {
          product_code: "TV001",
          product_name: "LED TV 32 inch",
          description: "Smart LED TV 32 inch",
          category: "Electronics",
          unit: "pcs",
          unit_price: 3500000,
          stock_quantity: 25,
          supplier_code: "G01",
          status: "active",
        },
      ],
      { onConflict: "product_code" },
    )

    if (productsError) {
      console.error("Error inserting products:", productsError)
    }

    console.log("Sample data inserted successfully")
  } catch (error) {
    console.error("Error inserting sample data:", error)
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to setup database",
    endpoints: {
      setup: "POST /api/supabase/setup",
      test: "GET /api/test-db",
    },
  })
}
