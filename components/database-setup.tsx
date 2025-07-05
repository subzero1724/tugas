"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle, XCircle, Settings } from "lucide-react"

export function DatabaseSetup() {
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

  const setupDatabase = async () => {
    setSetupStatus({ loading: true, success: null, error: null, message: null })

    try {
      const response = await fetch("/api/setup-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      setSetupStatus({
        loading: false,
        success: result.success,
        error: result.success ? null : result.error,
        message: result.message,
      })
    } catch (error) {
      setSetupStatus({
        loading: false,
        success: false,
        error: "Failed to setup database",
        message: "Network error occurred",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-blue-600" />
          <span>Database Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-600">
          <p>Click the button below to automatically setup your hosted database with:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Create all required tables</li>
            <li>Set up relationships and indexes</li>
            <li>Insert sample data (your original invoices)</li>
            <li>Configure database constraints</li>
          </ul>
        </div>

        {setupStatus.success === null && (
          <Button
            onClick={setupDatabase}
            disabled={setupStatus.loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {setupStatus.loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Setting up database...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Setup Database
              </>
            )}
          </Button>
        )}

        {setupStatus.success === true && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Database setup successful!</strong>
              <br />
              {setupStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {setupStatus.success === false && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Database setup failed:</strong>
              <br />
              {setupStatus.error}
              <br />
              <Button
                onClick={setupDatabase}
                variant="outline"
                size="sm"
                className="mt-2 border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
          <strong>Environment Variables Required:</strong>
          <br />
          Make sure you have configured your database connection in your hosting platform's environment variables.
        </div>
      </CardContent>
    </Card>
  )
}
