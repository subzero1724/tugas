import { createServerSupabaseClient } from "./supabase-client"
import type { Invoice, Supplier, Product, DashboardStats } from "./types"

const supabase = createServerSupabaseClient()

export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabase.from("suppliers").select("*").order("name")

    if (error) {
      console.error("Error fetching suppliers:", error)
      throw new Error(`Failed to fetch suppliers: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("getSuppliers error:", error)
    throw error
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from("products").select("*").order("name")

    if (error) {
      console.error("Error fetching products:", error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("getProducts error:", error)
    throw error
  }
}

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        supplier:suppliers(*)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching invoices:", error)
      throw new Error(`Failed to fetch invoices: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error("getInvoices error:", error)
    throw error
  }
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        supplier:suppliers(*),
        items:invoice_items(
          *,
          product:products(*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching invoice:", error)
      throw new Error(`Failed to fetch invoice: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("getInvoiceById error:", error)
    throw error
  }
}

export async function createInvoice(invoiceData: {
  supplier_code: string
  invoice_number: string
  invoice_date: string
  items: Array<{
    product_code: string
    quantity: number
    unit_price: number
  }>
}): Promise<Invoice> {
  try {
    // Calculate total amount
    const total_amount = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

    // Create the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        supplier_code: invoiceData.supplier_code,
        invoice_number: invoiceData.invoice_number,
        invoice_date: invoiceData.invoice_date,
        total_amount,
        status: "pending",
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError)
      throw new Error(`Failed to create invoice: ${invoiceError.message}`)
    }

    // Create invoice items
    const invoiceItems = invoiceData.items.map((item) => ({
      invoice_id: invoice.id,
      product_code: item.product_code,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
    }))

    const { error: itemsError } = await supabase.from("invoice_items").insert(invoiceItems)

    if (itemsError) {
      console.error("Error creating invoice items:", itemsError)
      throw new Error(`Failed to create invoice items: ${itemsError.message}`)
    }

    return invoice
  } catch (error) {
    console.error("createInvoice error:", error)
    throw error
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total invoices
    const { count: totalInvoices, error: invoicesError } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })

    if (invoicesError) {
      console.error("Error counting invoices:", invoicesError)
      throw new Error(`Failed to count invoices: ${invoicesError.message}`)
    }

    // Get total amount
    const { data: amountData, error: amountError } = await supabase.from("invoices").select("total_amount")

    if (amountError) {
      console.error("Error fetching amounts:", amountError)
      throw new Error(`Failed to fetch amounts: ${amountError.message}`)
    }

    const totalAmount = amountData?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0

    // Get pending invoices
    const { count: pendingInvoices, error: pendingError } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (pendingError) {
      console.error("Error counting pending invoices:", pendingError)
      throw new Error(`Failed to count pending invoices: ${pendingError.message}`)
    }

    // Get total suppliers
    const { count: totalSuppliers, error: suppliersError } = await supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })

    if (suppliersError) {
      console.error("Error counting suppliers:", suppliersError)
      throw new Error(`Failed to count suppliers: ${suppliersError.message}`)
    }

    return {
      totalInvoices: totalInvoices || 0,
      totalAmount: totalAmount,
      pendingInvoices: pendingInvoices || 0,
      totalSuppliers: totalSuppliers || 0,
    }
  } catch (error) {
    console.error("getDashboardStats error:", error)
    throw error
  }
}

// Export db object with all functions
export const db = {
  getSuppliers,
  getProducts,
  getInvoices,
  getInvoiceById,
  createInvoice,
  getDashboardStats,
}
