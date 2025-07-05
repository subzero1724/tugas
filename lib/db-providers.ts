// Database provider configurations for different hosting services

export const dbProviders = {
  // Railway - Free tier available
  railway: {
    host: process.env.RAILWAY_DB_HOST,
    user: process.env.RAILWAY_DB_USER,
    password: process.env.RAILWAY_DB_PASSWORD,
    database: process.env.RAILWAY_DB_NAME,
    port: Number.parseInt(process.env.RAILWAY_DB_PORT || "3306"),
    ssl: { rejectUnauthorized: false },
  },

  // PlanetScale - Serverless MySQL
  planetscale: {
    host: process.env.PLANETSCALE_HOST,
    username: process.env.PLANETSCALE_USERNAME,
    password: process.env.PLANETSCALE_PASSWORD,
    ssl: { rejectUnauthorized: true },
  },

  // Aiven - Cloud database service
  aiven: {
    host: process.env.AIVEN_HOST,
    user: process.env.AIVEN_USER,
    password: process.env.AIVEN_PASSWORD,
    database: process.env.AIVEN_DATABASE,
    port: Number.parseInt(process.env.AIVEN_PORT || "3306"),
    ssl: { rejectUnauthorized: true },
  },

  // FreeSQLDatabase - Free MySQL hosting
  freesqldatabase: {
    host: process.env.FREE_DB_HOST,
    user: process.env.FREE_DB_USER,
    password: process.env.FREE_DB_PASSWORD,
    database: process.env.FREE_DB_NAME,
    port: Number.parseInt(process.env.FREE_DB_PORT || "3306"),
  },

  // Local development
  local: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "invoice_management",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
  },
}

export function getDbConfig() {
  const provider = process.env.DB_PROVIDER || "local"

  switch (provider) {
    case "railway":
      return dbProviders.railway
    case "planetscale":
      return dbProviders.planetscale
    case "aiven":
      return dbProviders.aiven
    case "freesqldatabase":
      return dbProviders.freesqldatabase
    default:
      return dbProviders.local
  }
}
