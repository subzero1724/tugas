import mysql from "mysql2/promise"
import { getDbConfig } from "./db-providers"

// Enhanced database connection for hosted environments
let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    const config = getDbConfig()

    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      // Additional settings for hosted databases
      charset: "utf8mb4",
      timezone: "+00:00",
      dateStrings: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
    })
  }
  return pool
}

export async function executeQuery(query: string, params: any[] = []) {
  const connection = getPool()

  try {
    const [results] = await connection.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query:", query)
    console.error("Params:", params)

    // Log additional info for hosted environments
    if (process.env.NODE_ENV === "production") {
      console.error("DB Provider:", process.env.DB_PROVIDER)
      console.error("DB Host:", process.env.DB_HOST || "Not set")
    }

    throw error
  }
}

// Test connection with retry logic
export async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = getPool()
      const [rows] = await connection.execute("SELECT 1 as test")
      console.log("✅ Database connection successful")
      return true
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error)

      if (i === retries - 1) {
        console.error("❌ All database connection attempts failed")
        return false
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  return false
}

// Initialize database with hosted environment support
export async function initializeDatabase() {
  try {
    // Test connection first
    const connected = await testConnection()
    if (!connected) {
      return false
    }

    // Check if tables exist
    const [tables] = await executeQuery(
      `
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('suppliers', 'products', 'invoices', 'invoice_items')
    `,
      [getDbConfig().database],
    )

    if ((tables as any[]).length < 4) {
      console.log("⚠️  Database tables not found. Creating tables...")
      await createTables()
      await insertSampleData()
      console.log("✅ Database tables created and sample data inserted")
    } else {
      console.log("✅ Database tables verified")
    }

    return true
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return false
  }
}

// Create tables programmatically for hosted environments
async function createTables() {
  const createSuppliersTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      supplier_code VARCHAR(10) NOT NULL UNIQUE,
      supplier_name VARCHAR(100) NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(100),
      contact_person VARCHAR(100),
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      INDEX idx_supplier_code (supplier_code),
      INDEX idx_supplier_name (supplier_name),
      INDEX idx_status (status)
    )
  `

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT PRIMARY KEY AUTO_INCREMENT,
      product_code VARCHAR(20) NOT NULL UNIQUE,
      product_name VARCHAR(200) NOT NULL,
      category VARCHAR(50) DEFAULT 'Electronics',
      unit VARCHAR(20) DEFAULT 'pcs',
      base_price DECIMAL(15,2) DEFAULT 0,
      description TEXT,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      INDEX idx_product_code (product_code),
      INDEX idx_product_name (product_name),
      INDEX idx_category (category),
      INDEX idx_status (status)
    )
  `

  const createInvoicesTable = `
    CREATE TABLE IF NOT EXISTS invoices (
      id INT PRIMARY KEY AUTO_INCREMENT,
      invoice_number VARCHAR(50) NOT NULL UNIQUE,
      supplier_id INT NOT NULL,
      invoice_date DATE NOT NULL,
      due_date DATE,
      subtotal DECIMAL(15,2) DEFAULT 0,
      tax_amount DECIMAL(15,2) DEFAULT 0,
      discount_amount DECIMAL(15,2) DEFAULT 0,
      total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      status ENUM('draft', 'pending', 'approved', 'paid', 'cancelled') DEFAULT 'approved',
      notes TEXT,
      created_by VARCHAR(100) DEFAULT 'system',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      INDEX idx_invoice_number (invoice_number),
      INDEX idx_supplier_id (supplier_id),
      INDEX idx_invoice_date (invoice_date),
      INDEX idx_status (status),
      INDEX idx_total_amount (total_amount)
    )
  `

  const createInvoiceItemsTable = `
    CREATE TABLE IF NOT EXISTS invoice_items (
      id INT PRIMARY KEY AUTO_INCREMENT,
      invoice_id INT NOT NULL,
      product_id INT NOT NULL,
      product_code VARCHAR(20) NOT NULL,
      product_name VARCHAR(200) NOT NULL,
      quantity INT NOT NULL DEFAULT 1,
      unit_price DECIMAL(15,2) NOT NULL,
      line_total DECIMAL(15,2) NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      INDEX idx_invoice_id (invoice_id),
      INDEX idx_product_id (product_id),
      INDEX idx_product_code (product_code)
    )
  `

  // Execute table creation
  await executeQuery(createSuppliersTable)
  await executeQuery(createProductsTable)
  await executeQuery(createInvoicesTable)
  await executeQuery(createInvoiceItemsTable)

  // Add foreign key constraints
  try {
    await executeQuery(`
      ALTER TABLE invoices 
      ADD CONSTRAINT fk_invoices_supplier 
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id) 
      ON DELETE RESTRICT ON UPDATE CASCADE
    `)
  } catch (error) {
    // Constraint might already exist
    console.log("Foreign key constraint already exists or failed to create")
  }

  try {
    await executeQuery(`
      ALTER TABLE invoice_items 
      ADD CONSTRAINT fk_invoice_items_invoice 
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) 
      ON DELETE CASCADE ON UPDATE CASCADE
    `)
  } catch (error) {
    console.log("Foreign key constraint already exists or failed to create")
  }

  try {
    await executeQuery(`
      ALTER TABLE invoice_items 
      ADD CONSTRAINT fk_invoice_items_product 
      FOREIGN KEY (product_id) REFERENCES products(id) 
      ON DELETE RESTRICT ON UPDATE CASCADE
    `)
  } catch (error) {
    console.log("Foreign key constraint already exists or failed to create")
  }
}

// Insert sample data programmatically
async function insertSampleData() {
  // Insert suppliers
  const suppliers = [
    [
      "S01",
      "Hitachi",
      "Jl. Industri Raya No. 123, Jakarta Timur",
      "021-1234567",
      "sales@hitachi.co.id",
      "Budi Santoso",
    ],
    [
      "G01",
      "Global Nusantara",
      "Jl. Perdagangan No. 456, Surabaya",
      "031-7654321",
      "info@globalnusantara.co.id",
      "Siti Rahayu",
    ],
    [
      "T01",
      "Toshiba Electronics",
      "Jl. Elektronik No. 789, Bandung",
      "022-9876543",
      "contact@toshiba.co.id",
      "Ahmad Wijaya",
    ],
    ["P01", "Panasonic Indonesia", "Jl. Teknologi No. 321, Medan", "061-5555666", "sales@panasonic.co.id", "Maya Sari"],
  ]

  for (const supplier of suppliers) {
    try {
      await executeQuery(
        `
        INSERT IGNORE INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        supplier,
      )
    } catch (error) {
      console.log(`Supplier ${supplier[0]} already exists or failed to insert`)
    }
  }

  // Insert products
  const products = [
    [
      "S01",
      "RICE COOKER CC3",
      "Electronics",
      "pcs",
      1500000,
      "Rice cooker dengan kapasitas 1.8L, teknologi fuzzy logic",
    ],
    ["S02", "AC SPLIT 1 PK", "Electronics", "pcs", 3000000, "Air conditioner split 1 PK dengan teknologi inverter"],
    ["G01", "AC SPLIT ½ PK", "Electronics", "pcs", 2000000, "Air conditioner split 0.5 PK hemat energi"],
    ["G02", "AC SPLIT 1 PK", "Electronics", "pcs", 3000000, "Air conditioner split 1 PK dengan remote control"],
    ["T01", "MICROWAVE OVEN", "Electronics", "pcs", 1200000, "Microwave oven 23L dengan grill function"],
    ["P01", "WASHING MACHINE", "Electronics", "pcs", 2500000, "Mesin cuci front loading 7kg"],
  ]

  for (const product of products) {
    try {
      await executeQuery(
        `
        INSERT IGNORE INTO products (product_code, product_name, category, unit, base_price, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        product,
      )
    } catch (error) {
      console.log(`Product ${product[0]} already exists or failed to insert`)
    }
  }

  // Insert invoices and items
  const invoicesData = [
    {
      invoice: ["778", 1, "2025-04-18", 4500000, "approved", "admin"],
      items: [
        [1, "S01", "RICE COOKER CC3", 1, 1500000, 1500000],
        [2, "S02", "AC SPLIT 1 PK", 1, 3000000, 3000000],
      ],
    },
    {
      invoice: ["779", 2, "2025-06-15", 5000000, "approved", "admin"],
      items: [
        [3, "G01", "AC SPLIT ½ PK", 1, 2000000, 2000000],
        [4, "G02", "AC SPLIT 1 PK", 1, 3000000, 3000000],
      ],
    },
  ]

  for (let i = 0; i < invoicesData.length; i++) {
    const { invoice, items } = invoicesData[i]

    try {
      // Insert invoice
      const result = (await executeQuery(
        `
        INSERT IGNORE INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        invoice,
      )) as any

      const invoiceId = result.insertId || i + 1

      // Insert items
      for (const item of items) {
        try {
          await executeQuery(
            `
            INSERT IGNORE INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
            [invoiceId, ...item],
          )
        } catch (error) {
          console.log(`Invoice item already exists or failed to insert`)
        }
      }
    } catch (error) {
      console.log(`Invoice ${invoice[0]} already exists or failed to insert`)
    }
  }
}
