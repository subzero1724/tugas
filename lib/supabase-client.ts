import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Create a Supabase client that can be used on the server
 * (e.g. inside Route Handlers or Server Actions).
 * Falls back to the anon key if `SUPABASE_SERVICE_ROLE_KEY`
 * is not present.
 */
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("suppliers").select("count(*)").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection failed:", error)
    return { success: false, error: "Connection failed" }
  }
}
