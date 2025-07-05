import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Client-side Supabase client (uses anon key)
export const createClientSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Server-side Supabase client (uses service role key)
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const supabase = createClientSupabaseClient()
    const { data, error } = await supabase.from("suppliers").select("count").limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
