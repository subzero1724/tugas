"use client"

import { useState, useEffect } from "react"
import type { Invoice } from "@/lib/types"

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/invoices")
      const result = await response.json()

      if (result.success) {
        setInvoices(result.data)
        setError(null)
      } else {
        setError(result.error || "Failed to fetch invoices")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching invoices:", err)
    } finally {
      setLoading(false)
    }
  }

  const createInvoice = async (invoiceData: any) => {
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchInvoices() // Refresh the list
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      console.error("Error creating invoice:", err)
      return { success: false, error: "Network error occurred" }
    }
  }

  const getInvoiceById = async (id: number) => {
    try {
      const response = await fetch(`/api/invoices/${id}`)
      const result = await response.json()

      if (result.success) {
        return { success: true, data: result.data }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      console.error("Error fetching invoice:", err)
      return { success: false, error: "Network error occurred" }
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    getInvoiceById,
  }
}
