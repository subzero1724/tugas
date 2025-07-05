import { supabase, createServerSupabaseClient } from "./supabase-client"

export interface Supplier {
  id: number
  supplier_code: string
  supplier_name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  product_code: string
  product_name: string
  description?: string
  category?: string
  unit: string
  unit_price: number
  stock_quantity: number
  supplier_code?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: number
  invoice_number: string
  supplier_code: string
  invoice_date: string
  total_amount: number
  status: string
  payment_status?: string
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
  supplier?: Supplier
  items?: InvoiceItem[]
}

export interface InvoiceItem {
  id: number
  invoice_id: number
  product_code: string
  quantity: number
  unit_price: number
  line_total: number
  notes?: string
  product?: Product
}

export interface CreateInvoiceData {
  supplier_code: string
  invoice_number: string
  invoice_date: string
  total_amount: number
  status?: string
  notes?: string
  items: {
    product_code: string
    quantity: number
    unit_price: number
    line_total: number
  }[]
}

export interface DashboardStats {
  totalInvoices: number
  totalAmount: number
  pendingInvoices: number
  approvedInvoices: number
  recentInvoices: Invoice[]
}

// Get all suppliers
export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase.from("suppliers").select("*").eq("status", "active").order("supplier_name")

  if (error) {
    console.error("Error fetching suppliers:", error)
    throw new Error(error.message)
  }

  return data || []
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("status", "active").order("product_name")

  if (error) {
    console.error("Error fetching products:", error)
    throw new Error(error.message)
  }

  return data || []
}

// Get all invoices with supplier info
export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      suppliers!invoices_supplier_code_fkey (
        id,
        supplier_code,
        supplier_name,
        contact_person
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching invoices:", error)
    throw new Error(error.message)
  }

  return (
    data?.map((invoice) => ({
      ...invoice,
      supplier: invoice.suppliers,
    })) || []
  )
}

// Get invoice by ID with items
export async function getInvoiceById(id: number): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      suppliers!invoices_supplier_code_fkey (
        id,
        supplier_code,
        supplier_name,
        contact_person,
        phone,
        email,
        address
      ),
      invoice_items (
        *,
        products!invoice_items_product_code_fkey (
          id,
          product_code,
          product_name,
          unit
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching invoice:", error)
    throw new Error(error.message)
  }

  if (!data) return null

  return {
    ...data,
    supplier: data.suppliers,
    items:
      data.invoice_items?.map((item: any) => ({
        ...item,
        product: item.products,
      })) || [],
  }
}

// Create new invoice
export async function createInvoice(invoiceData: CreateInvoiceData): Promise<Invoice> {
  const supabaseAdmin = createServerSupabaseClient()

  try {
    // Insert invoice
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .insert({
        invoice_number: invoiceData.invoice_number,
        supplier_code: invoiceData.supplier_code,
        invoice_date: invoiceData.invoice_date,
        total_amount: invoiceData.total_amount,
        status: invoiceData.status || "pending",
        notes: invoiceData.notes,
        created_by: "system",
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError)
      throw new Error(invoiceError.message)
    }

    // Insert invoice items
    if (invoiceData.items && invoiceData.items.length > 0) {
      const itemsToInsert = invoiceData.items.map((item) => ({
        invoice_id: invoice.id,
        product_code: item.product_code,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      }))

      const { error: itemsError } = await supabaseAdmin.from("invoice_items").insert(itemsToInsert)

      if (itemsError) {
        console.error("Error creating invoice items:", itemsError)
        // Rollback invoice if items failed
        await supabaseAdmin.from("invoices").delete().eq("id", invoice.id)
        throw new Error(itemsError.message)
      }
    }

    return invoice
  } catch (error) {
    console.error("Error in createInvoice:", error)
    throw error
  }
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total invoices count
    const { count: totalInvoices } = await supabase.from("invoices").select("*", { count: "exact", head: true })

    // Get total amount
    const { data: amountData } = await supabase.from("invoices").select("total_amount")

    const totalAmount = amountData?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0

    // Get pending invoices count
    const { count: pendingInvoices } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Get approved invoices count
    const { count: approvedInvoices } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved")

    // Get recent invoices
    const { data: recentInvoices } = await supabase
      .from("invoices")
      .select(`
        *,
        suppliers!invoices_supplier_code_fkey (
          supplier_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    return {
      totalInvoices: totalInvoices || 0,
      totalAmount,
      pendingInvoices: pendingInvoices || 0,
      approvedInvoices: approvedInvoices || 0,
      recentInvoices:
        recentInvoices?.map((invoice) => ({
          ...invoice,
          supplier: invoice.suppliers,
        })) || [],
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalInvoices: 0,
      totalAmount: 0,
      pendingInvoices: 0,
      approvedInvoices: 0,
      recentInvoices: [],
    }
  }
}

// Export db object for compatibility
export const db = {
  getSuppliers,
  getProducts,
  getInvoices,
  getInvoiceById,
  createInvoice,
  getDashboardStats,
}
