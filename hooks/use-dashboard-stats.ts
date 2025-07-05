"use client"

import { useState, useEffect } from "react"
import type { DashboardStats } from "@/lib/supabase-db"

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Hook: Fetching dashboard stats...")
      const response = await fetch("/api/dashboard/stats")
      const result = await response.json()

      console.log("Hook: Dashboard stats response:", result)

      if (result.success) {
        setStats(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch dashboard statistics")
      }
    } catch (err) {
      console.error("Hook: Error fetching dashboard stats:", err)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}
