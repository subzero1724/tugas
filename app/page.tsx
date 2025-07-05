"use client"

import { useState } from "react"
import { InvoiceCard } from "@/components/invoice-card"
import { InvoiceStats } from "@/components/invoice-stats"
import { InvoiceForm } from "@/components/invoice-form"
import { SupabaseStatus } from "@/components/supabase-status"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus, List, Loader2, AlertCircle } from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const { invoices, loading: invoicesLoading, error: invoicesError, createInvoice } = useInvoices()
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats()

  const handleAddInvoice = async (formData: any) => {
    const invoiceData = {
      invoice_number: formData.invoiceNumber,
      supplier_code: formData.supplierCode,
      invoice_date: formData.date,
      items: formData.items.map((item: any) => ({
        product_code: item.code,
        product_name: item.name,
        quantity: item.qty,
        unit_price: item.price,
      })),
      notes: formData.notes || "",
      created_by: "admin",
    }

    const result = await createInvoice(invoiceData)

    if (result.success) {
      setShowForm(false)
      alert("Faktur berhasil dibuat!")
    } else {
      alert(`Error: ${result.error}`)
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SupabaseStatus />
          <div className="mb-6">
            <Button onClick={() => setShowForm(false)} variant="outline" className="mb-4">
              <List className="h-4 w-4 mr-2" />
              Kembali ke Daftar Faktur
            </Button>
          </div>
          <InvoiceForm onSubmit={handleAddInvoice} onCancel={() => setShowForm(false)} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <SupabaseStatus />

        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Sistem Manajemen Faktur Pembelian</h1>
              <p className="text-slate-600">Kelola dan pantau semua faktur pembelian barang dengan mudah</p>
              <p className="text-sm text-slate-500 mt-1">Powered by Supabase PostgreSQL Database</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Faktur Baru
            </Button>
          </div>
        </div>

        {/* Error Messages */}
        {(invoicesError || statsError) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{invoicesError || statsError}</AlertDescription>
          </Alert>
        )}

        {/* Stats Section */}
        {statsLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">Memuat statistik...</span>
          </div>
        ) : stats ? (
          <InvoiceStats
            totalInvoices={stats.totalInvoices}
            totalValue={stats.totalValue}
            totalItems={stats.totalItems}
          />
        ) : null}

        {/* Invoices Section */}
        {invoicesLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">Memuat faktur...</span>
          </div>
        ) : invoices.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={{
                  id: invoice.id,
                  supplierCode: invoice.supplier_code || "",
                  supplierName: invoice.supplier_name || "",
                  date: formatDateForDisplay(invoice.invoice_date),
                  invoiceNumber: invoice.invoice_number,
                  items: [], // Will be loaded when detail is opened
                  total: invoice.total_amount,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Belum ada faktur yang dibuat</p>
            <p className="text-slate-400 text-sm mt-2">
              Jika ini adalah pertama kali menggunakan aplikasi, klik "Setup Database" di atas untuk membuat data contoh
            </p>
            <Button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Faktur Pertama
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
