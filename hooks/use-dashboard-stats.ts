"use client"

import { useState, useEffect } from "react"

interface DashboardStats {
  totalInvoices: number
  totalValue: number
  totalItems: number
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching dashboard stats...")
      const response = await fetch("/api/dashboard/stats")
      const result = await response.json()

      console.log("Stats response:", result)

      if (result.success) {
        setStats(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch stats")
      }
    } catch (err) {
      console.error("Error fetching stats:", err)
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
