import { supabaseAdmin } from "./supabase-client"

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
  supplier_name?: string
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
  product_name?: string
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
    product_name: string
    quantity: number
    unit_price: number
    line_total: number
  }[]
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

export interface DashboardStats {
  totalInvoices: number
  totalValue: number
  totalItems: number
}

// Get all suppliers
export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("suppliers")
      .select("*")
      .eq("status", "active")
      .order("supplier_name")

    if (error) {
      console.error("Error fetching suppliers:", error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Error in getSuppliers:", error)
    throw error
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("status", "active")
      .order("product_name")

    if (error) {
      console.error("Error fetching products:", error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error("Error in getProducts:", error)
    throw error
  }
}

// Get all invoices with supplier info
export async function getInvoices(): Promise<Invoice[]> {
  try {
    const { data, error } = await supabaseAdmin
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
        supplier_name: invoice.suppliers?.supplier_name || invoice.supplier_code,
        supplier: invoice.suppliers,
      })) || []
    )
  } catch (error) {
    console.error("Error in getInvoices:", error)
    throw error
  }
}

// Get invoice by ID with items
export async function getInvoiceById(id: number): Promise<Invoice | null> {
  try {
    const { data, error } = await supabaseAdmin
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
      supplier_name: data.suppliers?.supplier_name || data.supplier_code,
      supplier: data.suppliers,
      items:
        data.invoice_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.product_name || item.product_code,
          product: item.products,
        })) || [],
    }
  } catch (error) {
    console.error("Error in getInvoiceById:", error)
    throw error
  }
}

// Create new invoice
export async function createInvoice(invoiceData: CreateInvoiceData): Promise<Invoice> {
  try {
    console.log("Creating invoice with data:", invoiceData)

    // Insert invoice
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from("invoices")
      .insert({
        invoice_number: invoiceData.invoice_number,
        supplier_code: invoiceData.supplier_code,
        invoice_date: invoiceData.invoice_date,
        total_amount: invoiceData.total_amount,
        status: invoiceData.status || "pending",
        notes: invoiceData.notes || "",
        created_by: "system",
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError)
      throw new Error(invoiceError.message)
    }

    console.log("Invoice created:", invoice)

    // Insert invoice items
    if (invoiceData.items && invoiceData.items.length > 0) {
      const itemsToInsert = invoiceData.items.map((item) => ({
        invoice_id: invoice.id,
        product_code: item.product_code,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      }))

      console.log("Inserting items:", itemsToInsert)

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
    const { count: totalInvoices } = await supabaseAdmin.from("invoices").select("*", { count: "exact", head: true })

    // Get total amount
    const { data: amountData } = await supabaseAdmin.from("invoices").select("total_amount")

    const totalValue =
      amountData?.reduce((sum, invoice) => {
        const amount = Number(invoice.total_amount) || 0
        return sum + amount
      }, 0) || 0

    // Get total items count
    const { data: itemsData } = await supabaseAdmin.from("invoice_items").select("quantity")

    const totalItems =
      itemsData?.reduce((sum, item) => {
        const qty = Number(item.quantity) || 0
        return sum + qty
      }, 0) || 0

    return {
      totalInvoices: totalInvoices || 0,
      totalValue,
      totalItems,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalInvoices: 0,
      totalValue: 0,
      totalItems: 0,
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
