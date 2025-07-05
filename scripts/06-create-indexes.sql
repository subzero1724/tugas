USE invoice_management;

-- Additional performance indexes
CREATE INDEX idx_invoices_date_status ON invoices(invoice_date, status);
CREATE INDEX idx_invoices_supplier_date ON invoices(supplier_id, invoice_date);
CREATE INDEX idx_invoice_items_invoice_product ON invoice_items(invoice_id, product_id);
CREATE INDEX idx_suppliers_name_status ON suppliers(supplier_name, status);
CREATE INDEX idx_products_name_category ON products(product_name, category);

-- Composite indexes for common queries
CREATE INDEX idx_invoice_items_code_name ON invoice_items(product_code, product_name);
CREATE INDEX idx_invoices_number_date ON invoices(invoice_number, invoice_date);
