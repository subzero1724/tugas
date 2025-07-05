"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle, ExternalLink } from "lucide-react"

export function SupabaseSetup() {
  const [setupStatus, setSetupStatus] = useState<{
    loading: boolean
    success: boolean | null
    error: string | null
    message: string | null
  }>({
    loading: false,
    success: null,
    error: null,
    message: null,
  })

  const testConnection = async () => {
    setSetupStatus({ loading: true, success: null, error: null, message: null })

    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()

      setSetupStatus({
        loading: false,
        success: result.success,
        error: result.success ? null : result.error,
        message: result.message || result.details,
      })
    } catch (error) {
      setSetupStatus({
        loading: false,
        success: false,
        error: "Failed to test database connection",
        message: "Network error occurred",
      })
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-green-600" />
          <span>Supabase Database Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-3">Setup Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>
              Create a new project at{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-900 inline-flex items-center"
              >
                supabase.com <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>Go to Settings → API to get your project URL and anon key</li>
            <li>Go to SQL Editor and run the migration scripts</li>
            <li>Set your environment variables in your deployment platform</li>
            <li>Test the connection using the button below</li>
          </ol>
        </div>

        {/* Environment Variables */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h3 className="font-semibold text-slate-800 mb-3">Required Environment Variables:</h3>
          <div className="space-y-2 text-sm font-mono bg-slate-800 text-green-400 p-3 rounded">
            <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
            <div>SUPABASE_SERVICE_ROLE_KEY=your-service-role-key</div>
          </div>
        </div>

        {/* SQL Migration Files */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-3">SQL Migration Files:</h3>
          <div className="space-y-2 text-sm text-yellow-700">
            <p>Run these SQL files in your Supabase SQL Editor:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <code>supabase/migrations/001_create_tables.sql</code> - Creates all tables
              </li>
              <li>
                <code>supabase/migrations/002_insert_sample_data.sql</code> - Inserts sample data
              </li>
            </ul>
          </div>
        </div>

        {/* Test Connection */}
        <div className="space-y-4">
          <Button
            onClick={testConnection}
            disabled={setupStatus.loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {setupStatus.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing connection...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Test Supabase Connection
              </>
            )}
          </Button>

          {setupStatus.success === true && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Supabase connection successful!</strong>
                <br />
                {setupStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {setupStatus.success === false && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Connection failed:</strong>
                <br />
                {setupStatus.error}
                <br />
                <small className="text-red-600">{setupStatus.message}</small>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Supabase Benefits:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• PostgreSQL database</li>
              <li>• Real-time subscriptions</li>
              <li>• Built-in authentication</li>
              <li>• Auto-generated APIs</li>
              <li>• Free tier: 500MB storage</li>
              <li>• Global CDN</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🚀 Ready Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Invoice management</li>
              <li>• Supplier tracking</li>
              <li>• Product catalog</li>
              <li>• Real-time updates</li>
              <li>• Dashboard analytics</li>
              <li>• Data validation</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
