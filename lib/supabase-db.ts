import { supabase } from "./supabase-client"

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
  supplier?: Supplier
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

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase.from("suppliers").select("*").eq("status", "active").order("supplier_name")

  if (error) {
    console.error("Error fetching suppliers:", error)
    throw error
  }

  return data || []
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("status", "active").order("product_name")

  if (error) {
    console.error("Error fetching products:", error)
    throw error
  }

  return data || []
}

export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      supplier:suppliers(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching invoices:", error)
    throw error
  }

  return data || []
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      supplier:suppliers(*),
      items:invoice_items(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching invoice:", error)
    throw error
  }

  return data
}

export async function createInvoice(invoiceData: {
  invoice_number: string
  supplier_id: string
  invoice_date: string
  due_date?: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  status: string
  notes?: string
  created_by?: string
  items: {
    product_id: string
    product_code: string
    product_name: string
    quantity: number
    unit_price: number
    line_total: number
    notes?: string
  }[]
}): Promise<Invoice> {
  try {
    // Create the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceData.invoice_number,
        supplier_id: invoiceData.supplier_id,
        invoice_date: invoiceData.invoice_date,
        due_date: invoiceData.due_date,
        subtotal: invoiceData.subtotal,
        tax_amount: invoiceData.tax_amount,
        discount_amount: invoiceData.discount_amount,
        total_amount: invoiceData.total_amount,
        status: invoiceData.status,
        notes: invoiceData.notes,
        created_by: invoiceData.created_by || "system",
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError)
      throw invoiceError
    }

    // Create invoice items
    if (invoiceData.items && invoiceData.items.length > 0) {
      const itemsToInsert = invoiceData.items.map((item) => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        product_code: item.product_code,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        notes: item.notes,
      }))

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert)

      if (itemsError) {
        console.error("Error creating invoice items:", itemsError)
        throw itemsError
      }
    }

    return invoice
  } catch (error) {
    console.error("Error in createInvoice:", error)
    throw error
  }
}

export async function getDashboardStats() {
  try {
    const { data: invoices, error } = await supabase.from("invoices").select("total_amount, status")

    if (error) throw error

    const totalInvoices = invoices?.length || 0
    const totalAmount = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
    const paidInvoices = invoices?.filter((inv) => inv.status === "paid").length || 0
    const pendingInvoices = invoices?.filter((inv) => inv.status === "pending").length || 0

    return {
      totalInvoices,
      totalAmount,
      paidInvoices,
      pendingInvoices,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalInvoices: 0,
      totalAmount: 0,
      paidInvoices: 0,
      pendingInvoices: 0,
    }
  }
}

/**
 * Simple object wrapper so other parts of the app can keep
 * importing { db } without refactoring.
 */
export const db = {
  getSuppliers,
  getProducts,
  getInvoices,
  getInvoiceById,
  createInvoice,
  getDashboardStats,
}
