USE invoice_management;

-- Insert Suppliers (based on your data)
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person) VALUES
('S01', 'Hitachi', 'Jl. Industri No. 123, Jakarta', '021-1234567', 'sales@hitachi.co.id', 'Budi Santoso'),
('G01', 'Global Nusantara', 'Jl. Perdagangan No. 456, Surabaya', '031-7654321', 'info@globalnusantara.co.id', 'Siti Rahayu');

-- Insert Products (based on your data)
INSERT INTO products (product_code, product_name, category, unit, base_price) VALUES
('S01', 'RICE COOKER CC3', 'Electronics', 'pcs', 1500000),
('S02', 'AC SPLIT 1 PK', 'Electronics', 'pcs', 3000000),
('G01', 'AC SPLIT ½ PK', 'Electronics', 'pcs', 2000000),
('G02', 'AC SPLIT 1 PK', 'Electronics', 'pcs', 3000000);

-- Insert Invoices (based on your data)
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, created_by) VALUES
('778', 1, '2025-04-18', 4500000, 'approved', 'admin'),
('779', 2, '2025-06-15', 5000000, 'approved', 'admin');

-- Insert Invoice Items (based on your data)
-- Invoice 778 (Hitachi)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
(1, 1, 'S01', 'RICE COOKER CC3', 1, 1500000, 1500000),
(1, 2, 'S02', 'AC SPLIT 1 PK', 1, 3000000, 3000000);

-- Invoice 779 (Global Nusantara)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
(2, 3, 'G01', 'AC SPLIT ½ PK', 1, 2000000, 2000000),
(2, 4, 'G02', 'AC SPLIT 1 PK', 1, 3000000, 3000000);
