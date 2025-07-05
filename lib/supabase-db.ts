import { createServerSupabaseClient } from "./supabase-client"

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
export class SupabaseDB {
  private supabase = createServerSupabaseClient()

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const { data, error } = await this.supabase
        .from("suppliers")
        .select("*")
        .eq("status", "active")
        .order("supplier_name")

      if (error) {
        console.error("Error fetching suppliers:", error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error("getSuppliers error:", error)
      throw error
    }
  }

  async createSupplier(supplier: Omit<Supplier, "id" | "created_at" | "updated_at">): Promise<Supplier> {
    const { data, error } = await this.supabase.from("suppliers").insert(supplier).select().single()

    if (error) throw error
    return data
  }

  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("product_name")

      if (error) {
        console.error("Error fetching products:", error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error("getProducts error:", error)
      throw error
    }
  }

  async createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
    const { data, error } = await this.supabase.from("products").insert(product).select().single()

    if (error) throw error
    return data
  }

  async getOrCreateProduct(productCode: string, productName: string, unitPrice: number): Promise<Product> {
    try {
      // Try to find existing product
      const { data: existingProduct, error: findError } = await this.supabase
        .from("products")
        .select("*")
        .eq("product_code", productCode)
        .single()

      if (existingProduct && !findError) {
        return existingProduct
      }

      // Create new product
      return await this.createProduct({
        product_code: productCode,
        product_name: productName,
        base_price: unitPrice,
        category: "Electronics",
        unit: "pcs",
        status: "active",
      })
    } catch (error) {
      console.error("getOrCreateProduct error:", error)
      throw error
    }
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    try {
      const { data, error } = await this.supabase
        .from("invoices")
        .select(`
          *,
          suppliers (
            supplier_code,
            supplier_name
          )
        `)
        .order("invoice_date", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching invoices:", error)
        throw error
      }

      return (data || []).map((invoice: any) => ({
        ...invoice,
        supplier_code: invoice.suppliers?.supplier_code,
        supplier_name: invoice.suppliers?.supplier_name,
      }))
    } catch (error) {
      console.error("getInvoices error:", error)
      throw error
    }
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const { data, error } = await this.supabase
        .from("invoices")
        .select(`
          *,
          suppliers (
            supplier_code,
            supplier_name,
            address,
            phone,
            email
          ),
          invoice_items (
            id,
            product_code,
            product_name,
            quantity,
            unit_price,
            line_total,
            notes
          )
        `)
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error fetching invoice by id:", error)
        throw error
      }
      if (!data) return null

      return {
        ...data,
        supplier_code: data.suppliers?.supplier_code,
        supplier_name: data.suppliers?.supplier_name,
        items: data.invoice_items || [],
      }
    } catch (error) {
      console.error("getInvoiceById error:", error)
      throw error
    }
  }

  async createInvoice(invoiceData: CreateInvoiceRequest): Promise<Invoice> {
    try {
      console.log("Creating invoice with data:", invoiceData)

      // Get supplier
      const { data: supplier, error: supplierError } = await this.supabase
        .from("suppliers")
        .select("id")
        .eq("supplier_code", invoiceData.supplier_code)
        .eq("status", "active")
        .single()

      if (supplierError || !supplier) {
        console.error("Supplier error:", supplierError)
        throw new Error(`Supplier with code '${invoiceData.supplier_code}' not found or inactive`)
      }

      console.log("Found supplier:", supplier)

      // Calculate total
      const total_amount = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

      console.log("Calculated total:", total_amount)

      // Create invoice
      const { data: invoice, error: invoiceError } = await this.supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceData.invoice_number,
          supplier_id: supplier.id,
          invoice_date: invoiceData.invoice_date,
          subtotal: total_amount,
          tax_amount: 0,
          discount_amount: 0,
          total_amount,
          status: "draft",
          notes: invoiceData.notes,
          created_by: invoiceData.created_by || "system",
        })
        .select()
        .single()

      if (invoiceError) {
        console.error("Invoice creation error:", invoiceError)
        throw invoiceError
      }

      console.log("Created invoice:", invoice)

      // Create invoice items
      const invoiceItems = []
      for (const item of invoiceData.items) {
        try {
          const product = await this.getOrCreateProduct(item.product_code, item.product_name, item.unit_price)

          const { data: invoiceItem, error: itemError } = await this.supabase
            .from("invoice_items")
            .insert({
              invoice_id: invoice.id,
              product_id: product.id,
              product_code: item.product_code,
              product_name: item.product_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              line_total: item.quantity * item.unit_price,
            })
            .select()
            .single()

          if (itemError) {
            console.error("Invoice item creation error:", itemError)
            throw itemError
          }
          invoiceItems.push(invoiceItem)
        } catch (itemError) {
          console.error("Error creating invoice item:", itemError)
          throw itemError
        }
      }

      console.log("Created invoice items:", invoiceItems)

      return {
        ...invoice,
        items: invoiceItems,
      }
    } catch (error) {
      console.error("createInvoice error:", error)
      throw error
    }
  }

  // Dashboard stats
  async getDashboardStats() {
    try {
      // Get total invoices
      const { count: totalInvoices } = await this.supabase.from("invoices").select("*", { count: "exact", head: true })

      // Get total value
      const { data: totalValueData } = await this.supabase.from("invoices").select("total_amount")

      const totalValue = totalValueData?.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0) || 0

      // Get total items
      const { count: totalItems } = await this.supabase
        .from("invoice_items")
        .select("*", { count: "exact", head: true })

      // Get monthly stats
      const { data: monthlyStats } = await this.supabase
        .from("invoices")
        .select("invoice_date, total_amount")
        .gte("invoice_date", new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0])

      const monthlyStatsGrouped = monthlyStats?.reduce((acc: any, invoice) => {
        const month = invoice.invoice_date.substring(0, 7) // YYYY-MM
        if (!acc[month]) {
          acc[month] = { month, invoice_count: 0, total_amount: 0 }
        }
        acc[month].invoice_count++
        acc[month].total_amount += Number(invoice.total_amount)
        return acc
      }, {})

      return {
        totalInvoices: totalInvoices || 0,
        totalValue,
        totalItems: totalItems || 0,
        monthlyStats: Object.values(monthlyStatsGrouped || {}).slice(0, 6),
      }
    } catch (error) {
      console.error("getDashboardStats error:", error)
      throw error
    }
  }
}

export const db = new SupabaseDB()
