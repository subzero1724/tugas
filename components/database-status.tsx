"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Database } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    loading: boolean
    error: string | null
    lastChecked: string | null
  }>({
    connected: false,
    loading: true,
    error: null,
    lastChecked: null,
  })

  const checkDatabaseStatus = async () => {
    setStatus((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch("/api/test-db")
      const result = await response.json()

      setStatus({
        connected: result.success,
        loading: false,
        error: result.success ? null : result.error,
        lastChecked: new Date().toLocaleTimeString("id-ID"),
      })
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: "Failed to connect to database API",
        lastChecked: new Date().toLocaleTimeString("id-ID"),
      })
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  if (status.loading) {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800">Checking database connection...</AlertDescription>
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
              <strong>Database Connection Failed:</strong> {status.error}
              {status.lastChecked && <div className="text-sm mt-1">Last checked: {status.lastChecked}</div>}
            </div>
            <Button
              onClick={checkDatabaseStatus}
              variant="outline"
              size="sm"
              className="ml-4 border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
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
            <strong>Database Connected Successfully</strong>
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
