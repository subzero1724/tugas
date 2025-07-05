"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Save, Calculator } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface InvoiceItem {
  code: string
  name: string
  qty: number
  price: number
  total: number
}

interface InvoiceFormData {
  supplierCode: string
  supplierName: string
  date: string
  invoiceNumber: string
  items: InvoiceItem[]
  total: number
}

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData) => void
  onCancel: () => void
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    supplierCode: "",
    supplierName: "",
    date: "",
    invoiceNumber: "",
    items: [{ code: "", name: "", qty: 1, price: 0, total: 0 }],
    total: 0,
  })

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

  const calculateItemTotal = (qty: number, price: number) => {
    return qty * price
  }

  const calculateGrandTotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...formData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate item total if qty or price changed
    if (field === "qty" || field === "price") {
      updatedItems[index].total = calculateItemTotal(updatedItems[index].qty, updatedItems[index].price)
    }

    const grandTotal = calculateGrandTotal(updatedItems)

    setFormData({
      ...formData,
      items: updatedItems,
      total: grandTotal,
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { code: "", name: "", qty: 1, price: 0, total: 0 }],
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index)
      const grandTotal = calculateGrandTotal(updatedItems)

      setFormData({
        ...formData,
        items: updatedItems,
        total: grandTotal,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFormValid = () => {
    return (
      formData.supplierCode.trim() !== "" &&
      formData.supplierName.trim() !== "" &&
      formData.date !== "" &&
      formData.invoiceNumber.trim() !== "" &&
      formData.items.every(
        (item) => item.code.trim() !== "" && item.name.trim() !== "" && item.qty > 0 && item.price > 0,
      )
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardTitle className="text-xl font-bold flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            <span>Form Input Faktur Pembelian Barang</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Supplier Information */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="supplierCode" className="text-sm font-medium text-slate-700">
                  Kode Supplier *
                </Label>
                <Input
                  id="supplierCode"
                  value={formData.supplierCode}
                  onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                  placeholder="Contoh: S01, G01"
                  className="bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierName" className="text-sm font-medium text-slate-700">
                  Nama Supplier *
                </Label>
                <Input
                  id="supplierName"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  placeholder="Contoh: Hitachi, Global Nusantara"
                  className="bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                  Tanggal *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber" className="text-sm font-medium text-slate-700">
                  Nomor Nota *
                </Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="Contoh: 778, 779"
                  className="bg-white"
                  required
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Detail Barang</h3>
                <Button
                  type="button"
                  onClick={addItem}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <Card key={index} className="border-2 border-slate-200">
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-6 gap-3 items-end">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-600">Kode *</Label>
                          <Input
                            value={item.code}
                            onChange={(e) => updateItem(index, "code", e.target.value)}
                            placeholder="S01"
                            className="text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-xs font-medium text-slate-600">Nama Barang *</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(index, "name", e.target.value)}
                            placeholder="RICE COOKER CC3"
                            className="text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-600">Qty *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => updateItem(index, "qty", Number.parseInt(e.target.value) || 1)}
                            className="text-sm"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-slate-600">Harga *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => updateItem(index, "price", Number.parseInt(e.target.value) || 0)}
                            placeholder="1500000"
                            className="text-sm"
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <Badge variant="secondary" className="w-full justify-center bg-blue-50 text-blue-700">
                              {formatNumber(item.total)}
                            </Badge>
                          </div>
                          {formData.items.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeItem(index)}
                              variant="outline"
                              size="sm"
                              className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-700">Total Keseluruhan:</span>
                <span className="text-2xl font-bold text-blue-700">{formatCurrency(formData.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={!isFormValid()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan Faktur
              </Button>
              <Button type="button" onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
