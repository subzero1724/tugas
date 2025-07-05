import { SupabaseSetup } from "@/components/supabase-setup"
import { Header } from "@/components/header"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Supabase Database Setup</h1>
          <p className="text-slate-600">Configure your PostgreSQL database with Supabase</p>
        </div>

        <SupabaseSetup />
      </main>
    </div>
  )
}
