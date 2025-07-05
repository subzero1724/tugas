"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Settings, RefreshCw } from "lucide-react"

export function SupabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "failed">("checking")
  const [lastChecked, setLastChecked] = useState<string>("")
  const [isSettingUp, setIsSettingUp] = useState(false)

  const checkConnection = async () => {
    try {
      setStatus("checking")
      const response = await fetch("/api/test-db")
      const result = await response.json()

      if (result.success) {
        setStatus("connected")
      } else {
        setStatus("failed")
      }
    } catch (error) {
      console.error("Connection check failed:", error)
      setStatus("failed")
    } finally {
      setLastChecked(new Date().toLocaleTimeString("id-ID"))
    }
  }

  const setupDatabase = async () => {
    try {
      setIsSettingUp(true)
      const response = await fetch("/api/supabase/setup", {
        method: "POST",
      })
      const result = await response.json()

      if (result.success) {
        await checkConnection()
        alert("Database setup berhasil!")
      } else {
        alert("Database setup gagal: " + result.error)
      }
    } catch (error) {
      console.error("Setup failed:", error)
      alert("Database setup gagal: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsSettingUp(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (status === "checking") {
    return (
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
        <AlertDescription className="text-blue-800">Memeriksa koneksi database...</AlertDescription>
      </Alert>
    )
  }

  if (status === "connected") {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex justify-between items-center">
            <span>Supabase Connected Successfully</span>
            <div className="flex gap-2">
              <Button
                onClick={checkConnection}
                variant="outline"
                size="sm"
                className="text-green-700 border-green-300 hover:bg-green-100 bg-transparent"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Test Again
              </Button>
            </div>
          </div>
          <div className="text-xs text-green-600 mt-1">Last checked: {lastChecked}</div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <XCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        <div className="flex justify-between items-center">
          <span>Supabase Connection Failed: Supabase connection failed</span>
          <div className="flex gap-2">
            <Button
              onClick={setupDatabase}
              disabled={isSettingUp}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
            >
              <Settings className="h-3 w-3 mr-1" />
              {isSettingUp ? "Setting up..." : "Setup Database"}
            </Button>
            <Button
              onClick={checkConnection}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100 bg-transparent"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
        <div className="text-xs text-red-600 mt-1">Last checked: {lastChecked}</div>
        <div className="text-xs text-red-600 mt-1">
          The database might need to be set up. Click "Setup Database" to create tables and sample data.
        </div>
      </AlertDescription>
    </Alert>
  )
}
