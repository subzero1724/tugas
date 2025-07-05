import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    console.log("🚀 Setting up Supabase database...")

    // Test connection first
    const { error: connectionError } = await supabase.from("suppliers").select("count").limit(1)

    if (connectionError && connectionError.code === "42P01") {
      // Table doesn't exist, create it
      console.log("Creating database tables...")

      // Create suppliers table
      const { error: suppliersError } = await supabase.rpc("exec_sql", {
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (suppliersError) {
        console.error("Error creating suppliers table:", suppliersError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create suppliers table",
            details: suppliersError.message,
          },
          { status: 500 },
        )
      }

      // Create products table
      const { error: productsError } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            product_code VARCHAR(50) UNIQUE NOT NULL,
            product_name VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(100),
            unit VARCHAR(20) DEFAULT 'pcs',
            unit_price DECIMAL(15,2) DEFAULT 0,
            stock_quantity INTEGER DEFAULT 0,
            supplier_code VARCHAR(20),
            status VARCHAR(20) DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            FOREIGN KEY (supplier_code) REFERENCES suppliers(supplier_code)
          );
        `,
      })

      if (productsError) {
        console.error("Error creating products table:", productsError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create products table",
            details: productsError.message,
          },
          { status: 500 },
        )
      }

      // Create invoices table
      const { error: invoicesError } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS invoices (
            id SERIAL PRIMARY KEY,
            invoice_number VARCHAR(50) UNIQUE NOT NULL,
            supplier_code VARCHAR(20) NOT NULL,
            invoice_date DATE NOT NULL,
            total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
            status VARCHAR(20) DEFAULT 'pending',
            notes TEXT,
            created_by VARCHAR(100) DEFAULT 'system',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            FOREIGN KEY (supplier_code) REFERENCES suppliers(supplier_code)
          );
        `,
      })

      if (invoicesError) {
        console.error("Error creating invoices table:", invoicesError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create invoices table",
            details: invoicesError.message,
          },
          { status: 500 },
        )
      }

      // Create invoice_items table
      const { error: itemsError } = await supabase.rpc("exec_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS invoice_items (
            id SERIAL PRIMARY KEY,
            invoice_id INTEGER NOT NULL,
            product_code VARCHAR(50) NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price DECIMAL(15,2) NOT NULL,
            line_total DECIMAL(15,2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
            FOREIGN KEY (product_code) REFERENCES products(product_code)
          );
        `,
      })

      if (itemsError) {
        console.error("Error creating invoice_items table:", itemsError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create invoice_items table",
            details: itemsError.message,
          },
          { status: 500 },
        )
      }

      // Insert sample data
      await insertSampleData(supabase)

      return NextResponse.json({
        success: true,
        message: "Database setup completed successfully",
        action: "created_tables_and_data",
      })
    }

    // Check if we have data
    const { data: suppliers, error: suppliersError } = await supabase.from("suppliers").select("count").limit(1)

    if (suppliersError) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: suppliersError.message,
        },
        { status: 500 },
      )
    }

    if (!suppliers || suppliers.length === 0) {
      console.log("Tables exist but no data, inserting sample data...")
      await insertSampleData(supabase)

      return NextResponse.json({
        success: true,
        message: "Sample data inserted successfully",
        action: "inserted_sample_data",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database is already set up and contains data",
      action: "already_setup",
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

async function insertSampleData(supabase: any) {
  // Insert suppliers
  const { error: suppliersError } = await supabase.from("suppliers").upsert(
    [
      {
        supplier_code: "SUP001",
        supplier_name: "PT Elektronik Jaya",
        contact_person: "Budi Santoso",
        phone: "021-1234567",
        email: "budi@elektronikjaya.com",
        address: "Jl. Sudirman No. 123",
        city: "Jakarta",
      },
      {
        supplier_code: "Sg01",
        supplier_name: "Topyota",
        contact_person: "Toyota Sales",
        phone: "021-6789012",
        email: "sales@topyota.com",
        address: "Jl. Toyota No. 987",
        city: "Jakarta",
      },
    ],
    { onConflict: "supplier_code" },
  )

  if (suppliersError) {
    console.error("Error inserting suppliers:", suppliersError)
    throw new Error(suppliersError.message)
  }

  // Insert products
  const { error: productsError } = await supabase.from("products").upsert(
    [
      {
        product_code: "LAPTOP001",
        product_name: "Laptop Dell Inspiron 15",
        description: "Laptop Dell Inspiron 15 inch, Intel i5, 8GB RAM, 512GB SSD",
        category: "Komputer",
        unit: "unit",
        unit_price: 8500000,
        stock_quantity: 10,
        supplier_code: "SUP001",
      },
      {
        product_code: "S21",
        product_name: "ra",
        description: "Sample product ra",
        category: "Sample",
        unit: "unit",
        unit_price: 20,
        stock_quantity: 100,
        supplier_code: "Sg01",
      },
    ],
    { onConflict: "product_code" },
  )

  if (productsError) {
    console.error("Error inserting products:", productsError)
    throw new Error(productsError.message)
  }

  console.log("Sample data inserted successfully")
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
