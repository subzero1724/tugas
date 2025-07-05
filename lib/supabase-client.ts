import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client (for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes)
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Attempts a lightweight query against the `suppliers` table
 * to confirm the Supabase credentials are valid.
 */
export async function testSupabaseConnection() {
  try {
    // We only need a trivial query to ensure connectivity
    const { error } = await supabase.from("suppliers").select("id").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Connected to Supabase successfully" }
  } catch (err) {
    console.error("Supabase test failed:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    }
  }
}
