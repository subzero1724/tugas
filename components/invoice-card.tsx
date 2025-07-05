"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building2, FileText, Eye, Download } from "lucide-react"
import { InvoiceDetailModal } from "@/components/invoice-detail-modal"
import { useState } from "react"

interface Invoice {
  id: number
  supplierCode: string
  supplierName: string
  date: string
  invoiceNumber: string
  items: any[]
  total: number
}

interface InvoiceCardProps {
  invoice: Invoice
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const [showDetail, setShowDetail] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-slate-800">Faktur #{invoice.invoiceNumber}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Building2 className="h-4 w-4" />
                <span>{invoice.supplierName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{invoice.date}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {invoice.supplierCode}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700 flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Faktur Pembelian</span>
          </h4>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="font-medium text-slate-800">Total Pembelian</p>
                <p className="text-sm text-slate-600">Supplier: {invoice.supplierName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">{formatCurrency(invoice.total)}</p>
                <p className="text-sm text-slate-500">#{invoice.invoiceNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-slate-700">Total:</span>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => setShowDetail(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail
            </Button>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>

      <InvoiceDetailModal invoiceId={invoice.id} isOpen={showDetail} onClose={() => setShowDetail(false)} />
    </Card>
  )
}
