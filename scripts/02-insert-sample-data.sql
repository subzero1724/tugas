USE invoice_management;

-- Insert Suppliers
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('S01', 'Hitachi', 'Jl. Industri Raya No. 123, Jakarta Timur', '021-1234567', 'sales@hitachi.co.id', 'Budi Santoso', 'active'),
('G01', 'Global Nusantara', 'Jl. Perdagangan No. 456, Surabaya', '031-7654321', 'info@globalnusantara.co.id', 'Siti Rahayu', 'active'),
('T01', 'Toshiba Electronics', 'Jl. Elektronik No. 789, Bandung', '022-9876543', 'contact@toshiba.co.id', 'Ahmad Wijaya', 'active'),
('P01', 'Panasonic Indonesia', 'Jl. Teknologi No. 321, Medan', '061-5555666', 'sales@panasonic.co.id', 'Maya Sari', 'active');

-- Insert Products
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('S01', 'RICE COOKER CC3', 'Electronics', 'pcs', 1500000, 'Rice cooker dengan kapasitas 1.8L, teknologi fuzzy logic', 'active'),
('S02', 'AC SPLIT 1 PK', 'Electronics', 'pcs', 3000000, 'Air conditioner split 1 PK dengan teknologi inverter', 'active'),
('G01', 'AC SPLIT ½ PK', 'Electronics', 'pcs', 2000000, 'Air conditioner split 0.5 PK hemat energi', 'active'),
('G02', 'AC SPLIT 1 PK', 'Electronics', 'pcs', 3000000, 'Air conditioner split 1 PK dengan remote control', 'active'),
('T01', 'MICROWAVE OVEN', 'Electronics', 'pcs', 1200000, 'Microwave oven 23L dengan grill function', 'active'),
('P01', 'WASHING MACHINE', 'Electronics', 'pcs', 2500000, 'Mesin cuci front loading 7kg', 'active');

-- Insert Invoices (Your original data)
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, created_by) VALUES
('778', 1, '2025-04-18', 4500000, 'approved', 'admin'),
('779', 2, '2025-06-15', 5000000, 'approved', 'admin'),
('780', 3, '2025-07-01', 1200000, 'approved', 'admin'),
('781', 4, '2025-07-05', 2500000, 'approved', 'admin');

-- Insert Invoice Items
-- Invoice 778 (Hitachi)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
(1, 1, 'S01', 'RICE COOKER CC3', 1, 1500000, 1500000),
(1, 2, 'S02', 'AC SPLIT 1 PK', 1, 3000000, 3000000);

-- Invoice 779 (Global Nusantara)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
(2, 3, 'G01', 'AC SPLIT ½ PK', 1, 2000000, 2000000),
(2, 4, 'G02', 'AC SPLIT 1 PK', 1, 3000000, 3000000);

-- Invoice 780 (Toshiba)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
(3, 5, 'T01', 'MICROWAVE OVEN', 1, 1200000, 1200000);

-- Invoice 781 (Panasonic)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
(4, 6, 'P01', 'WASHING MACHINE', 1, 2500000, 2500000);
