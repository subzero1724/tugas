import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const createClientSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("suppliers").select("count").limit(1)

    if (error) {
      console.error("Supabase connection error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Connected successfully" }
  } catch (error) {
    console.error("Supabase connection test failed:", error)
    return { success: false, error: "Connection failed" }
  }
}
