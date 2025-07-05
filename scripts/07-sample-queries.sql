USE invoice_management;

-- Sample queries to test the database

-- 1. Get all invoices with supplier information
SELECT * FROM invoice_summary ORDER BY invoice_date DESC;

-- 2. Get detailed invoice information for a specific invoice
SELECT * FROM invoice_detail WHERE invoice_number = '778';

-- 3. Get supplier statistics
SELECT * FROM supplier_summary ORDER BY total_purchase_amount DESC;

-- 4. Get product statistics
SELECT * FROM product_summary ORDER BY total_sales_amount DESC;

-- 5. Get monthly purchase summary
SELECT 
    DATE_FORMAT(invoice_date, '%Y-%m') as month,
    COUNT(*) as total_invoices,
    SUM(total_amount) as total_amount,
    AVG(total_amount) as average_amount
FROM invoices 
GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
ORDER BY month DESC;

-- 6. Get top selling products
SELECT 
    product_code,
    product_name,
    SUM(quantity) as total_quantity,
    SUM(line_total) as total_sales
FROM invoice_items
GROUP BY product_code, product_name
ORDER BY total_sales DESC;

-- 7. Get supplier purchase history
SELECT 
    s.supplier_name,
    i.invoice_number,
    i.invoice_date,
    i.total_amount,
    COUNT(ii.id) as item_count
FROM suppliers s
JOIN invoices i ON s.id = i.supplier_id
JOIN invoice_items ii ON i.id = ii.invoice_id
GROUP BY s.supplier_name, i.invoice_number, i.invoice_date, i.total_amount
ORDER BY s.supplier_name, i.invoice_date DESC;

-- 8. Get invoice items with product details
SELECT 
    i.invoice_number,
    i.invoice_date,
    s.supplier_name,
    ii.product_code,
    ii.product_name,
    ii.quantity,
    ii.unit_price,
    ii.line_total
FROM invoices i
JOIN suppliers s ON i.supplier_id = s.id
JOIN invoice_items ii ON i.id = ii.invoice_id
ORDER BY i.invoice_date DESC, ii.product_code;
