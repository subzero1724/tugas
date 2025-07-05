"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, DollarSign, Package, Users, CheckCircle, XCircle } from "lucide-react"
import { InvoiceForm } from "@/components/invoice-form"
import { testSupabaseConnection } from "@/lib/supabase-client"
import { toast } from "@/hooks/use-toast"

interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  total_amount: number
  status: string
  supplier_code: string
  supplier_name: string
}

interface ConnectionStatus {
  success: boolean
  error?: string
  message?: string
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null)
  const [lastChecked, setLastChecked] = useState<string>("")

  // Test database connection
  const checkConnection = async () => {
    try {
      const result = await testSupabaseConnection()
      setConnectionStatus(result)
      setLastChecked(new Date().toLocaleTimeString())
    } catch (error) {
      setConnectionStatus({
        success: false,
        error: "Connection test failed",
      })
      setLastChecked(new Date().toLocaleTimeString())
    }
  }

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      const data = await response.json()

      if (data.success) {
        setInvoices(data.data || [])
      } else {
        console.error("Failed to fetch invoices:", data.error)
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()
    fetchInvoices()
  }, [])

  const handleFormSubmit = async (formData: any) => {
    try {
      console.log("Submitting form data:", formData)

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("API response:", result)

      if (result.success) {
        toast({
          title: "Success!",
          description: "Invoice created successfully",
        })
        setShowForm(false)
        fetchInvoices() // Refresh the list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create invoice",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <InvoiceForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
                <p className="text-sm text-gray-500">Purchase Management System</p>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {connectionStatus?.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="text-sm">
                      <div className="text-green-600 font-medium">Supabase Connected Successfully</div>
                      <div className="text-gray-500">Last checked: {lastChecked}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div className="text-sm">
                      <div className="text-red-600 font-medium">Supabase Connection Failed</div>
                      <div className="text-gray-500">Last checked: {lastChecked}</div>
                    </div>
                  </>
                )}
                <Button onClick={checkConnection} variant="outline" size="sm" className="ml-2 bg-transparent">
                  Test Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total_amount, 0))}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invoices.filter((inv) => inv.status === "pending").length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(invoices.map((inv) => inv.supplier_code)).size}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Daftar Faktur</h2>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Kembali ke Daftar Faktur
          </Button>
        </div>

        {/* Invoices List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading invoices...</div>
            </div>
          ) : invoices.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first invoice</p>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </CardContent>
            </Card>
          ) : (
            invoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Supplier:</span>
                          <div>{invoice.supplier_name}</div>
                          <div className="text-xs text-gray-500">({invoice.supplier_code})</div>
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>
                          <div>{new Date(invoice.invoice_date).toLocaleDateString("id-ID")}</div>
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>
                          <div className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</div>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
