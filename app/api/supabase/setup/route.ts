import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    console.log("🚀 Setting up Supabase database...")

    // Check if tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["suppliers", "products", "invoices", "invoice_items"])

    if (tablesError) {
      console.log("Tables don't exist yet, creating them...")
      await createTables(supabase)
      await insertSampleData(supabase)

      return NextResponse.json({
        success: true,
        message: "Database setup completed successfully",
        action: "created_tables_and_data",
      })
    }

    if (!tables || tables.length < 4) {
      console.log("Some tables missing, creating them...")
      await createTables(supabase)
      await insertSampleData(supabase)

      return NextResponse.json({
        success: true,
        message: "Database setup completed successfully",
        action: "created_missing_tables",
      })
    }

    // Tables exist, check if they have data
    const { data: supplierCount } = await supabase.from("suppliers").select("*", { count: "exact", head: true })

    if (!supplierCount || supplierCount === 0) {
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

async function createTables(supabase: any) {
  // Create suppliers table
  await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS suppliers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        supplier_code VARCHAR(10) NOT NULL UNIQUE,
        supplier_name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        contact_person VARCHAR(100),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
      CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(supplier_name);
    `,
  })

  // Create products table
  await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_code VARCHAR(20) NOT NULL UNIQUE,
        product_name VARCHAR(200) NOT NULL,
        category VARCHAR(50) DEFAULT 'Electronics',
        unit VARCHAR(20) DEFAULT 'pcs',
        base_price DECIMAL(15,2) DEFAULT 0,
        description TEXT,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
      CREATE INDEX IF NOT EXISTS idx_products_name ON products(product_name);
    `,
  })

  // Create invoices table
  await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        invoice_number VARCHAR(50) NOT NULL UNIQUE,
        supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
        invoice_date DATE NOT NULL,
        due_date DATE,
        subtotal DECIMAL(15,2) DEFAULT 0,
        tax_amount DECIMAL(15,2) DEFAULT 0,
        discount_amount DECIMAL(15,2) DEFAULT 0,
        total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'cancelled')),
        notes TEXT,
        created_by VARCHAR(100) DEFAULT 'system',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
      CREATE INDEX IF NOT EXISTS idx_invoices_supplier ON invoices(supplier_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
    `,
  })

  // Create invoice_items table
  await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS invoice_items (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        product_code VARCHAR(20) NOT NULL,
        product_name VARCHAR(200) NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price DECIMAL(15,2) NOT NULL,
        line_total DECIMAL(15,2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
      CREATE INDEX IF NOT EXISTS idx_invoice_items_product ON invoice_items(product_id);
    `,
  })
}

async function insertSampleData(supabase: any) {
  // Insert suppliers
  const { data: suppliers } = await supabase
    .from("suppliers")
    .upsert(
      [
        {
          supplier_code: "S01",
          supplier_name: "Hitachi",
          address: "Jl. Industri Raya No. 123, Jakarta Timur",
          phone: "021-1234567",
          email: "sales@hitachi.co.id",
          contact_person: "Budi Santoso",
        },
        {
          supplier_code: "G01",
          supplier_name: "Global Nusantara",
          address: "Jl. Perdagangan No. 456, Surabaya",
          phone: "031-7654321",
          email: "info@globalnusantara.co.id",
          contact_person: "Siti Rahayu",
        },
      ],
      { onConflict: "supplier_code" },
    )
    .select()

  // Insert products
  const { data: products } = await supabase
    .from("products")
    .upsert(
      [
        {
          product_code: "S01",
          product_name: "RICE COOKER CC3",
          category: "Electronics",
          unit: "pcs",
          base_price: 1500000,
          description: "Rice cooker dengan kapasitas 1.8L, teknologi fuzzy logic",
        },
        {
          product_code: "S02",
          product_name: "AC SPLIT 1 PK",
          category: "Electronics",
          unit: "pcs",
          base_price: 3000000,
          description: "Air conditioner split 1 PK dengan teknologi inverter",
        },
        {
          product_code: "G01",
          product_name: "AC SPLIT ½ PK",
          category: "Electronics",
          unit: "pcs",
          base_price: 2000000,
          description: "Air conditioner split 0.5 PK hemat energi",
        },
        {
          product_code: "G02",
          product_name: "AC SPLIT 1 PK",
          category: "Electronics",
          unit: "pcs",
          base_price: 3000000,
          description: "Air conditioner split 1 PK dengan remote control",
        },
      ],
      { onConflict: "product_code" },
    )
    .select()

  if (suppliers && products) {
    // Insert sample invoices
    const hitachiSupplier = suppliers.find((s) => s.supplier_code === "S01")
    const globalSupplier = suppliers.find((s) => s.supplier_code === "G01")

    if (hitachiSupplier && globalSupplier) {
      const { data: invoices } = await supabase
        .from("invoices")
        .upsert(
          [
            {
              invoice_number: "778",
              supplier_id: hitachiSupplier.id,
              invoice_date: "2025-04-18",
              total_amount: 4500000,
              status: "approved",
              created_by: "admin",
            },
            {
              invoice_number: "779",
              supplier_id: globalSupplier.id,
              invoice_date: "2025-06-15",
              total_amount: 5000000,
              status: "approved",
              created_by: "admin",
            },
          ],
          { onConflict: "invoice_number" },
        )
        .select()

      if (invoices) {
        // Insert invoice items
        const invoice778 = invoices.find((i) => i.invoice_number === "778")
        const invoice779 = invoices.find((i) => i.invoice_number === "779")

        const riceCooker = products.find((p) => p.product_code === "S01")
        const acSplit1pk = products.find((p) => p.product_code === "S02")
        const acSplitHalf = products.find((p) => p.product_code === "G01")
        const acSplit1pkGlobal = products.find((p) => p.product_code === "G02")

        if (invoice778 && invoice779 && riceCooker && acSplit1pk && acSplitHalf && acSplit1pkGlobal) {
          await supabase.from("invoice_items").upsert([
            // Invoice 778 items
            {
              invoice_id: invoice778.id,
              product_id: riceCooker.id,
              product_code: "S01",
              product_name: "RICE COOKER CC3",
              quantity: 1,
              unit_price: 1500000,
              line_total: 1500000,
            },
            {
              invoice_id: invoice778.id,
              product_id: acSplit1pk.id,
              product_code: "S02",
              product_name: "AC SPLIT 1 PK",
              quantity: 1,
              unit_price: 3000000,
              line_total: 3000000,
            },
            // Invoice 779 items
            {
              invoice_id: invoice779.id,
              product_id: acSplitHalf.id,
              product_code: "G01",
              product_name: "AC SPLIT ½ PK",
              quantity: 1,
              unit_price: 2000000,
              line_total: 2000000,
            },
            {
              invoice_id: invoice779.id,
              product_id: acSplit1pkGlobal.id,
              product_code: "G02",
              product_name: "AC SPLIT 1 PK",
              quantity: 1,
              unit_price: 3000000,
              line_total: 3000000,
            },
          ])
        }
      }
    }
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
