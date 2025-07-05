"use client"

import { Receipt, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">InvoiceApp</h1>
              <p className="text-sm text-slate-500">Purchase Management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Tambah Faktur
            </Button>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
