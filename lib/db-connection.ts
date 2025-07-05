// Update the main db connection to use hosted configuration
import mysql from "mysql2/promise"
import { getDbConfig } from "./db-providers"

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

    if (process.env.NODE_ENV === "production") {
      console.error("DB Provider:", process.env.DB_PROVIDER)
    }

    throw error
  }
}

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

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
  return false
}

export async function initializeDatabase() {
  try {
    const connected = await testConnection()
    if (!connected) {
      return false
    }

    const [tables] = await executeQuery(
      `
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('suppliers', 'products', 'invoices', 'invoice_items')
    `,
      [getDbConfig().database],
    )

    if ((tables as any[]).length < 4) {
      console.log("⚠️  Database tables not found. Please run setup or use /setup page.")
      return false
    }

    console.log("✅ Database tables verified")
    return true
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    return false
  }
}
