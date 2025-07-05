"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download, PrinterIcon as Print, Calendar, Building2, FileText, Hash, Loader2 } from "lucide-react"

interface InvoiceItem {
  id: number
  product_code: string
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
}

interface InvoiceDetail {
  id: number
  invoice_number: string
  invoice_date: string
  supplier_code: string
  supplier_name: string
  total_amount: number
  items: InvoiceItem[]
}

interface InvoiceDetailModalProps {
  invoiceId: number | null
  isOpen: boolean
  onClose: () => void
}

export function InvoiceDetailModal({ invoiceId, isOpen, onClose }: InvoiceDetailModalProps) {
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && invoiceId) {
      fetchInvoiceDetail()
    }
  }, [isOpen, invoiceId])

  const fetchInvoiceDetail = async () => {
    if (!invoiceId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/invoices/${invoiceId}`)
      const result = await response.json()

      if (result.success) {
        setInvoice(result.data)
      } else {
        setError(result.error || "Failed to fetch invoice details")
      }
    } catch (err) {
      setError("Network error occurred")
      console.error("Error fetching invoice detail:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    alert("Fitur download akan segera tersedia!")
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-white">
          {/* Header with Actions */}
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center space-x-3">
                <FileText className="h-8 w-8" />
                <span>Detail Faktur Pembelian</span>
              </DialogTitle>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePrint}
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  disabled={loading || !invoice}
                >
                  <Print className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  disabled={loading || !invoice}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-8 bg-white print:p-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-slate-600">Memuat detail faktur...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchInvoiceDetail} variant="outline">
                  Coba Lagi
                </Button>
              </div>
            ) : invoice ? (
              <>
                {/* Invoice Header */}
                <div className="border-2 border-slate-800 mb-6 print:border-black">
                  <div className="bg-slate-800 text-white p-4 text-center print:bg-black">
                    <h1 className="text-2xl font-bold tracking-wide">FAKTUR PEMBELIAN BARANG</h1>
                  </div>

                  {/* Invoice Info Grid */}
                  <div className="p-6 grid md:grid-cols-2 gap-6">
                    {/* Left Column - Supplier Info */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600">Kode Supplier</p>
                          <p className="text-lg font-bold text-slate-800">{invoice.supplier_code}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-600">Nama Supplier</p>
                        <p className="text-xl font-bold text-slate-800">{invoice.supplier_name}</p>
                      </div>
                    </div>

                    {/* Right Column - Invoice Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600">Tanggal</p>
                          <p className="text-lg font-bold text-slate-800">{formatDate(invoice.invoice_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Hash className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm font-medium text-slate-600">Nomor Nota</p>
                          <Badge variant="secondary" className="text-lg font-bold bg-blue-100 text-blue-800 px-3 py-1">
                            {invoice.invoice_number}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border-2 border-slate-300 mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100 border-b-2 border-slate-300">
                          <th className="text-left p-4 font-bold text-slate-800 border-r border-slate-300">Kode</th>
                          <th className="text-left p-4 font-bold text-slate-800 border-r border-slate-300">
                            Nama Barang
                          </th>
                          <th className="text-center p-4 font-bold text-slate-800 border-r border-slate-300">Qty</th>
                          <th className="text-right p-4 font-bold text-slate-800 border-r border-slate-300">Harga</th>
                          <th className="text-right p-4 font-bold text-slate-800">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items?.map((item, index) => (
                          <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-800 border-r border-slate-200">
                              {item.product_code}
                            </td>
                            <td className="p-4 text-slate-800 border-r border-slate-200">{item.product_name}</td>
                            <td className="p-4 text-center text-slate-800 border-r border-slate-200">
                              {formatNumber(item.quantity)}
                            </td>
                            <td className="p-4 text-right text-slate-800 border-r border-slate-200 font-mono">
                              {formatNumber(item.unit_price)}
                            </td>
                            <td className="p-4 text-right text-slate-800 font-mono font-semibold">
                              {formatNumber(item.line_total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-slate-300">
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-800">Total</span>
                        <span className="text-2xl font-bold text-blue-700 font-mono">
                          {formatNumber(invoice.total_amount)}
                        </span>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="text-lg font-semibold text-slate-600">
                          {formatCurrency(invoice.total_amount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-600">Total Item</p>
                      <p className="text-2xl font-bold text-blue-800">{invoice.items?.length || 0}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-green-600">Total Quantity</p>
                      <p className="text-2xl font-bold text-green-800">
                        {formatNumber(invoice.items?.reduce((sum, item) => sum + item.quantity, 0) || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-purple-600">Rata-rata Harga</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {formatNumber(
                          Math.round(
                            invoice.total_amount / (invoice.items?.reduce((sum, item) => sum + item.quantity, 0) || 1),
                          ),
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="text-center text-sm text-slate-600">
                    <p className="font-medium">Dokumen ini dibuat secara otomatis oleh sistem</p>
                    <p>
                      Tanggal cetak:{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
