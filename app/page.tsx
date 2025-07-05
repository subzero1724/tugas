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
import { Toaster, toast } from "sonner" // Import Toaster dan toast

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const { invoices, loading: invoicesLoading, error: invoicesError, createInvoice } = useInvoices()
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats()

  const handleAddInvoice = async (formData: any) => {
    // Tampilkan notifikasi loading
    const toastId = toast.loading("Sedang membuat faktur...")

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
      toast.success("Faktur berhasil dibuat!", { id: toastId })
      setShowForm(false)
    } else {
      // Tampilkan notifikasi error dengan pesan dari backend
      toast.error(result.error || "Gagal membuat faktur.", { id: toastId })
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
  
  // Render komponen utama
  return (
    <>
      <Toaster richColors position="top-center" /> 
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {showForm ? (
            <>
              <SupabaseStatus />
              <div className="mb-6">
                <Button onClick={() => setShowForm(false)} variant="outline" className="mb-4">
                  <List className="h-4 w-4 mr-2" />
                  Kembali ke Daftar Faktur
                </Button>
              </div>
              <InvoiceForm onSubmit={handleAddInvoice} onCancel={() => setShowForm(false)} />
            </>
          ) : (
            <>
              <SupabaseStatus />
              <div className="mb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Sistem Manajemen Faktur</h1>
                    <p className="text-slate-600">Kelola dan pantau semua faktur pembelian barang.</p>
                    <p className="text-sm text-slate-500 mt-1">Powered by Supabase</p>
                  </div>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Faktur
                  </Button>
                </div>
              </div>

              {(invoicesError || statsError) && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{invoicesError || statsError}</AlertDescription>
                </Alert>
              )}

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
                        items: [],
                        total: invoice.total_amount,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">Belum ada faktur yang dibuat</p>
                  <Button onClick={() => setShowForm(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Faktur Pertama
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
