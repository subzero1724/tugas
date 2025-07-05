import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-client"

const supabase = createServerSupabaseClient()

export async function GET() {
  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select(`
        *,
        suppliers (
          supplier_code,
          supplier_name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching invoices:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const formattedInvoices = (invoices || []).map((invoice: any) => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      total_amount: Number(invoice.total_amount),
      status: invoice.status,
      supplier_code: invoice.suppliers?.supplier_code,
      supplier_name: invoice.suppliers?.supplier_name,
      created_at: invoice.created_at,
      updated_at: invoice.updated_at,
    }))

    return NextResponse.json({
      success: true,
      data: formattedInvoices,
      count: formattedInvoices.length,
    })
  } catch (error) {
    console.error("Error in GET /api/invoices:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received invoice data:", body)

    // Transform form data to match API expectations
    const invoiceData = {
      invoice_number: body.invoiceNumber,
      supplier_code: body.supplierCode,
      invoice_date: body.date,
      items: body.items.map((item: any) => ({
        product_code: item.code,
        product_name: item.name,
        quantity: item.qty,
        unit_price: item.price,
      })),
      notes: `Invoice for ${body.supplierName}`,
      created_by: "system",
    }

    console.log("Transformed invoice data:", invoiceData)

    // Validate required fields
    if (
      !invoiceData.invoice_number ||
      !invoiceData.supplier_code ||
      !invoiceData.invoice_date ||
      !invoiceData.items ||
      invoiceData.items.length === 0
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get supplier
    const { data: supplier, error: supplierError } = await supabase
      .from("suppliers")
      .select("id")
      .eq("supplier_code", invoiceData.supplier_code)
      .eq("status", "active")
      .single()

    if (supplierError || !supplier) {
      console.error("Supplier error:", supplierError)
      return NextResponse.json(
        { success: false, error: `Supplier with code '${invoiceData.supplier_code}' not found or inactive` },
        { status: 400 },
      )
    }

    // Calculate total
    const total_amount = invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceData.invoice_number,
        supplier_id: supplier.id,
        invoice_date: invoiceData.invoice_date,
        total_amount,
        subtotal: total_amount,
        tax_amount: 0,
        discount_amount: 0,
        status: "pending",
        notes: invoiceData.notes,
        created_by: invoiceData.created_by,
      })
      .select()
      .single()

    if (invoiceError) {
      console.error("Invoice creation error:", invoiceError)
      return NextResponse.json(
        { success: false, error: `Failed to create invoice: ${invoiceError.message}` },
        { status: 500 },
      )
    }

    // Create invoice items
    const invoiceItems = []
    for (const item of invoiceData.items) {
      // Get or create product
      let { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("product_code", item.product_code)
        .single()

      if (productError || !product) {
        // Create new product
        const { data: newProduct, error: createProductError } = await supabase
          .from("products")
          .insert({
            product_code: item.product_code,
            product_name: item.product_name,
            base_price: item.unit_price,
            category: "Electronics",
            unit: "pcs",
            status: "active",
          })
          .select()
          .single()

        if (createProductError) {
          console.error("Product creation error:", createProductError)
          return NextResponse.json(
            { success: false, error: `Failed to create product: ${createProductError.message}` },
            { status: 500 },
          )
        }
        product = newProduct
      }

      // Create invoice item
      const { data: invoiceItem, error: itemError } = await supabase
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
        return NextResponse.json(
          { success: false, error: `Failed to create invoice item: ${itemError.message}` },
          { status: 500 },
        )
      }

      invoiceItems.push(invoiceItem)
    }

    console.log("Invoice created successfully:", invoice.id)

    return NextResponse.json({
      success: true,
      data: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        total_amount: invoice.total_amount,
      },
      message: "Invoice created successfully",
    })
  } catch (error) {
    console.error("Error in POST /api/invoices:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
