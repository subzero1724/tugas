import { supabaseAdmin } from "./supabase-client"

export interface Supplier {
  id: string
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
  id: string
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
  id: string
  invoice_number: string
  supplier_id: string
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
  id: string
  invoice_id: string
  product_id: string
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

// Database operations using Supabase
export const supabaseDb = {
  // Get all suppliers
  async getSuppliers() {
    const { data, error } = await supabaseAdmin.from("suppliers").select("*").order("supplier_code")

    if (error) throw error
    return data
  },

  // Get all products
  async getProducts() {
    const { data, error } = await supabaseAdmin.from("products").select("*").order("product_code")

    if (error) throw error
    return data
  },

  // Get all invoices with supplier info
  async getInvoices() {
    const { data, error } = await supabaseAdmin
      .from("invoices")
      .select(`
        *,
        suppliers (
          supplier_name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data?.map((invoice) => ({
      ...invoice,
      supplier_name: invoice.suppliers?.supplier_name || "Unknown",
    }))
  },

  // Get invoice by ID with items
  async getInvoiceById(id: string) {
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .select(`
        *,
        suppliers (
          supplier_name
        )
      `)
      .eq("id", id)
      .single()

    if (invoiceError) throw invoiceError

    const { data: items, error: itemsError } = await supabaseAdmin
      .from("invoice_items")
      .select(`
        *,
        products (
          product_name
        )
      `)
      .eq("invoice_id", id)
      .order("id")

    if (itemsError) throw itemsError

    return {
      ...invoice,
      supplier_name: invoice.suppliers?.supplier_name || "Unknown",
      items:
        items?.map((item) => ({
          ...item,
          product_name: item.products?.product_name || item.product_code,
        })) || [],
    }
  },

  // Create new invoice
  async createInvoice(invoiceData: any) {
    const { items, ...invoice } = invoiceData

    // Insert invoice
    const { data: newInvoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .insert([invoice])
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // Insert invoice items
    if (items && items.length > 0) {
      const invoiceItems = items.map((item: any) => ({
        invoice_id: newInvoice.id,
        product_code: item.product_code,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.quantity * item.unit_price,
      }))

      const { error: itemsError } = await supabaseAdmin.from("invoice_items").insert(invoiceItems)

      if (itemsError) throw itemsError
    }

    return newInvoice
  },

  // Get dashboard stats
  async getDashboardStats() {
    const [invoicesResult, itemsResult] = await Promise.all([
      supabaseAdmin.from("invoices").select("total_amount"),
      supabaseAdmin.from("invoice_items").select("quantity"),
    ])

    if (invoicesResult.error) throw invoicesResult.error
    if (itemsResult.error) throw itemsResult.error

    const totalInvoices = invoicesResult.data?.length || 0
    const totalValue = invoicesResult.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
    const totalItems = itemsResult.data?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0

    return {
      totalInvoices,
      totalValue,
      totalItems,
    }
  },
}

// Export as db for compatibility
export const db = supabaseDb
