"use client"

import { useState, useEffect } from "react"

interface DashboardStats {
  totalInvoices: number
  totalValue: number
  totalItems: number
  monthlyStats: Array<{
    month: string
    invoice_count: number
    total_amount: number
  }>
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/stats")
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch stats")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}
