export interface Supplier {
  id: number
  supplier_code: string
  supplier_name: string
  address?: string
  phone?: string
  email?: string
  contact_person?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  product_code: string
  product_name: string
  category?: string
  unit: string
  base_price: number
  description?: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  supplier_id: number
  supplier_code?: string
  supplier_name?: string
  invoice_date: string
  due_date?: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  status: "draft" | "pending" | "approved" | "paid" | "cancelled"
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: number
  invoice_id: number
  product_id: number
  product_code: string
  product_name: string
  quantity: number
  unit_price: number
  line_total: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateInvoiceRequest {
  invoice_number: string
  supplier_code: string
  invoice_date: string
  items: {
    product_code: string
    product_name: string
    quantity: number
    unit_price: number
  }[]
  notes?: string
  created_by?: string
}
