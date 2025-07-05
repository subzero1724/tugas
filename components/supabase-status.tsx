"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Database, Settings } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    loading: boolean
    error: string | null
    lastChecked: string | null
    setupLoading: boolean
  }>({
    connected: false,
    loading: true,
    error: null,
    lastChecked: null,
    setupLoading: false,
  })

  const checkDatabaseStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()

      setStatus((prev) => ({
        ...prev,
        connected: result.success,
        loading: false,
        error: result.success ? null : result.error,
        lastChecked: new Date().toLocaleTimeString("id-ID"),
      }))
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        connected: false,
        loading: false,
        error: "Failed to connect to Supabase API",
        lastChecked: new Date().toLocaleTimeString("id-ID"),
      }))
    }
  }

  const setupDatabase = async () => {
    setStatus((prev) => ({ ...prev, setupLoading: true }))

    try {
      const response = await fetch("/api/supabase/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (result.success) {
        // Recheck connection after setup
        await checkDatabaseStatus()
        alert(`Setup successful: ${result.message}`)
      } else {
        alert(`Setup failed: ${result.error}`)
      }
    } catch (error) {
      alert("Setup failed: Network error occurred")
    } finally {
      setStatus((prev) => ({ ...prev, setupLoading: false }))
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  if (status.loading) {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800">Checking Supabase connection...</AlertDescription>
      </Alert>
    )
  }

  if (!status.connected) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <div className="flex justify-between items-center">
            <div>
              <strong>Supabase Connection Failed:</strong> {status.error}
              {status.lastChecked && <div className="text-sm mt-1">Last checked: {status.lastChecked}</div>}
              <div className="text-sm mt-2 text-red-600">
                The database might need to be set up. Click "Setup Database" to create tables and sample data.
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <Button
                onClick={setupDatabase}
                disabled={status.setupLoading}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
              >
                {status.setupLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4 mr-2" />
                )}
                Setup Database
              </Button>
              <Button
                onClick={checkDatabaseStatus}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        <div className="flex justify-between items-center">
          <div>
            <strong>Supabase Connected Successfully</strong>
            {status.lastChecked && <div className="text-sm mt-1">Last checked: {status.lastChecked}</div>}
          </div>
          <Button
            onClick={checkDatabaseStatus}
            variant="outline"
            size="sm"
            className="ml-4 border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
          >
            <Database className="h-4 w-4 mr-2" />
            Test Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
