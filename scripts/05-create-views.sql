USE invoice_management;

-- View: invoice_summary
-- Provides a comprehensive view of invoices with supplier information
CREATE VIEW invoice_summary AS
SELECT 
    i.id,
    i.invoice_number,
    i.invoice_date,
    s.supplier_code,
    s.supplier_name,
    i.subtotal,
    i.tax_amount,
    i.discount_amount,
    i.total_amount,
    i.status,
    COUNT(ii.id) as total_items,
    SUM(ii.quantity) as total_quantity,
    i.created_at,
    i.updated_at
FROM invoices i
LEFT JOIN suppliers s ON i.supplier_id = s.id
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
GROUP BY i.id, i.invoice_number, i.invoice_date, s.supplier_code, s.supplier_name, 
         i.subtotal, i.tax_amount, i.discount_amount, i.total_amount, i.status, 
         i.created_at, i.updated_at;

-- View: invoice_detail
-- Provides detailed view of invoice items
CREATE VIEW invoice_detail AS
SELECT 
    i.id as invoice_id,
    i.invoice_number,
    i.invoice_date,
    s.supplier_code,
    s.supplier_name,
    ii.id as item_id,
    ii.product_code,
    ii.product_name,
    ii.quantity,
    ii.unit_price,
    ii.line_total,
    p.category as product_category,
    p.unit as product_unit
FROM invoices i
LEFT JOIN suppliers s ON i.supplier_id = s.id
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
LEFT JOIN products p ON ii.product_id = p.id
ORDER BY i.invoice_number, ii.id;

-- View: supplier_summary
-- Provides supplier statistics
CREATE VIEW supplier_summary AS
SELECT 
    s.id,
    s.supplier_code,
    s.supplier_name,
    s.status,
    COUNT(i.id) as total_invoices,
    COALESCE(SUM(i.total_amount), 0) as total_purchase_amount,
    COALESCE(AVG(i.total_amount), 0) as average_invoice_amount,
    MAX(i.invoice_date) as last_purchase_date,
    s.created_at
FROM suppliers s
LEFT JOIN invoices i ON s.id = i.supplier_id
GROUP BY s.id, s.supplier_code, s.supplier_name, s.status, s.created_at;

-- View: product_summary
-- Provides product statistics
CREATE VIEW product_summary AS
SELECT 
    p.id,
    p.product_code,
    p.product_name,
    p.category,
    p.base_price,
    p.status,
    COUNT(ii.id) as total_orders,
    COALESCE(SUM(ii.quantity), 0) as total_quantity_sold,
    COALESCE(SUM(ii.line_total), 0) as total_sales_amount,
    COALESCE(AVG(ii.unit_price), 0) as average_selling_price,
    MAX(i.invoice_date) as last_sold_date
FROM products p
LEFT JOIN invoice_items ii ON p.id = ii.product_id
LEFT JOIN invoices i ON ii.invoice_id = i.id
GROUP BY p.id, p.product_code, p.product_name, p.category, p.base_price, p.status;
