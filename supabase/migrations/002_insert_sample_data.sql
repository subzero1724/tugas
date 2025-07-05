-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('SUP001', 'PT Elektronik Jaya', 'Jl. Sudirman No. 123, Jakarta', '021-12345678', 'info@elektronikjaya.com', 'Budi Santoso', 'active'),
('SUP002', 'CV Komputer Prima', 'Jl. Gatot Subroto No. 456, Bandung', '022-87654321', 'sales@komputerprima.com', 'Siti Rahayu', 'active'),
('SUP003', 'UD Teknologi Maju', 'Jl. Ahmad Yani No. 789, Surabaya', '031-11223344', 'contact@teknologimaju.com', 'Ahmad Wijaya', 'active'),
('SUP004', 'PT Digital Solutions', 'Jl. Diponegoro No. 321, Yogyakarta', '0274-55667788', 'info@digitalsolutions.com', 'Maya Sari', 'active'),
('SUP005', 'CV Hardware Center', 'Jl. Pahlawan No. 654, Medan', '061-99887766', 'sales@hardwarecenter.com', 'Rudi Hartono', 'active')
ON CONFLICT (supplier_code) DO NOTHING;

-- Insert sample products
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('LAPTOP001', 'Laptop ASUS VivoBook 14', 'Electronics', 'pcs', 7500000, 'Laptop dengan processor Intel Core i5, RAM 8GB, SSD 512GB', 'active'),
('LAPTOP002', 'Laptop Lenovo ThinkPad E14', 'Electronics', 'pcs', 8500000, 'Business laptop dengan processor AMD Ryzen 5, RAM 8GB, SSD 256GB', 'active'),
('MOUSE001', 'Mouse Wireless Logitech M705', 'Electronics', 'pcs', 450000, 'Mouse wireless dengan baterai tahan lama', 'active'),
('KEYBOARD001', 'Keyboard Mechanical Corsair K70', 'Electronics', 'pcs', 1200000, 'Keyboard gaming mechanical dengan RGB lighting', 'active'),
('MONITOR001', 'Monitor LG 24 inch Full HD', 'Electronics', 'pcs', 2100000, 'Monitor LED 24 inch resolusi 1920x1080', 'active'),
('PRINTER001', 'Printer Canon PIXMA G2010', 'Electronics', 'pcs', 1800000, 'Printer inkjet dengan sistem tinta infus', 'active'),
('WEBCAM001', 'Webcam Logitech C920', 'Electronics', 'pcs', 950000, 'Webcam HD 1080p untuk video conference', 'active'),
('SPEAKER001', 'Speaker Bluetooth JBL Flip 5', 'Electronics', 'pcs', 1350000, 'Speaker portable dengan kualitas suara premium', 'active'),
('HEADSET001', 'Headset Gaming SteelSeries Arctis 7', 'Electronics', 'pcs', 2200000, 'Headset gaming wireless dengan surround sound', 'active'),
('TABLET001', 'Tablet Samsung Galaxy Tab A8', 'Electronics', 'pcs', 3200000, 'Tablet Android dengan layar 10.5 inch', 'active'),
('PRD001', 'Laptop ASUS VivoBook', 'Electronics', 'pcs', 8500000.00, 'Laptop ASUS VivoBook 14 inch, RAM 8GB, SSD 512GB', 'active'),
('PRD002', 'Mouse Wireless Logitech', 'Electronics', 'pcs', 250000.00, 'Mouse wireless Logitech M705 dengan baterai tahan lama', 'active'),
('PRD003', 'Keyboard Mechanical', 'Electronics', 'pcs', 750000.00, 'Keyboard mechanical RGB dengan switch blue', 'active'),
('PRD004', 'Monitor LED 24 inch', 'Electronics', 'pcs', 2500000.00, 'Monitor LED 24 inch Full HD 1920x1080', 'active'),
('PRD005', 'Printer Canon Pixma', 'Electronics', 'pcs', 1200000.00, 'Printer Canon Pixma G2010 dengan sistem infus', 'active'),
('PRD006', 'Webcam HD Logitech', 'Electronics', 'pcs', 450000.00, 'Webcam Logitech C920 HD 1080p untuk video conference', 'active'),
('PRD007', 'Headset Gaming', 'Electronics', 'pcs', 350000.00, 'Headset gaming dengan microphone dan LED RGB', 'active'),
('PRD008', 'SSD External 1TB', 'Electronics', 'pcs', 1800000.00, 'SSD External 1TB USB 3.0 portable', 'active'),
('PRD009', 'Router WiFi TP-Link', 'Electronics', 'pcs', 650000.00, 'Router WiFi TP-Link AC1200 dual band', 'active'),
('PRD010', 'Power Bank 20000mAh', 'Electronics', 'pcs', 300000.00, 'Power Bank 20000mAh dengan fast charging', 'active')
ON CONFLICT (product_code) DO NOTHING;

-- Insert sample invoices
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by) VALUES
('INV-2024-001', (SELECT id FROM suppliers WHERE supplier_code = 'SUP001'), '2024-01-15', 16450000, 'paid', 'Pembelian laptop dan aksesoris untuk kantor', 'admin'),
('INV-2024-002', (SELECT id FROM suppliers WHERE supplier_code = 'SUP002'), '2024-01-20', 12750000, 'paid', 'Pembelian peralatan komputer', 'admin'),
('INV-2024-003', (SELECT id FROM suppliers WHERE supplier_code = 'SUP003'), '2024-02-05', 8950000, 'approved', 'Pembelian gadget dan aksesoris', 'admin'),
('INV-2024-004', (SELECT id FROM suppliers WHERE supplier_code = 'SUP004'), '2024-02-12', 5400000, 'pending', 'Pembelian monitor dan printer', 'admin'),
('INV-2024-005', (SELECT id FROM suppliers WHERE supplier_code = 'SUP005'), '2024-02-18', 7850000, 'draft', 'Pembelian peralatan multimedia', 'admin'),
('INV-2024-001', (SELECT id FROM suppliers WHERE supplier_code = 'SUP001'), '2024-01-15', 17500000.00, 'paid', 'Pembelian laptop untuk kantor', 'admin'),
('INV-2024-002', (SELECT id FROM suppliers WHERE supplier_code = 'SUP002'), '2024-01-20', 3000000.00, 'approved', 'Pembelian peralatan komputer', 'admin'),
('INV-2024-003', (SELECT id FROM suppliers WHERE supplier_code = 'SUP003'), '2024-01-25', 1950000.00, 'pending', 'Pembelian printer dan webcam', 'admin'),
('INV-2024-004', (SELECT id FROM suppliers WHERE supplier_code = 'SUP004'), '2024-02-01', 1000000.00, 'draft', 'Pembelian headset gaming', 'admin'),
('INV-2024-005', (SELECT id FROM suppliers WHERE supplier_code = 'SUP005'), '2024-02-05', 2450000.00, 'paid', 'Pembelian router dan power bank', 'admin')
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample invoice items for INV-2024-001
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'LAPTOP001'), 'LAPTOP001', 'Laptop ASUS VivoBook 14', 2, 7500000, 15000000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'MOUSE001'), 'MOUSE001', 'Mouse Wireless Logitech M705', 2, 450000, 900000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'KEYBOARD001'), 'KEYBOARD001', 'Keyboard Mechanical Corsair K70', 1, 1200000, 1200000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'WEBCAM001'), 'WEBCAM001', 'Webcam Logitech C920', 1, 950000, 950000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'PRD001'), 'PRD001', 'Laptop ASUS VivoBook', 2, 8500000.00, 17000000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'PRD002'), 'PRD002', 'Mouse Wireless Logitech', 2, 250000.00, 500000.00);

-- Insert sample invoice items for INV-2024-002
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'LAPTOP002'), 'LAPTOP002', 'Laptop Lenovo ThinkPad E14', 1, 8500000, 8500000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'MONITOR001'), 'MONITOR001', 'Monitor LG 24 inch Full HD', 2, 2100000, 4200000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'PRD003'), 'PRD003', 'Keyboard Mechanical', 4, 750000.00, 3000000.00);

-- Insert sample invoice items for INV-2024-003
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'TABLET001'), 'TABLET001', 'Tablet Samsung Galaxy Tab A8', 2, 3200000, 6400000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'HEADSET001'), 'HEADSET001', 'Headset Gaming SteelSeries Arctis 7', 1, 2200000, 2200000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'PRD005'), 'PRD005', 'Printer Canon Pixma', 1, 1200000.00, 1200000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'PRD006'), 'PRD006', 'Webcam HD Logitech', 1, 450000.00, 450000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'PRD010'), 'PRD010', 'Power Bank 20000mAh', 1, 300000.00, 300000.00);

-- Insert sample invoice items for INV-2024-004
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'MONITOR001'), 'MONITOR001', 'Monitor LG 24 inch Full HD', 1, 2100000, 2100000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'PRINTER001'), 'PRINTER001', 'Printer Canon PIXMA G2010', 1, 1800000, 1800000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'SPEAKER001'), 'SPEAKER001', 'Speaker Bluetooth JBL Flip 5', 1, 1350000, 1350000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'PRD007'), 'PRD007', 'Headset Gaming', 2, 350000.00, 700000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'PRD010'), 'PRD010', 'Power Bank 20000mAh', 1, 300000.00, 300000.00);

-- Insert sample invoice items for INV-2024-005
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'SPEAKER001'), 'SPEAKER001', 'Speaker Bluetooth JBL Flip 5', 3, 1350000, 4050000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'WEBCAM001'), 'WEBCAM001', 'Webcam Logitech C920', 4, 950000, 3800000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'PRD009'), 'PRD009', 'Router WiFi TP-Link', 3, 650000.00, 1950000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'PRD008'), 'PRD008', 'SSD External 1TB', 1, 1800000.00, 1800000.00);

-- Update invoice totals to match item totals
UPDATE invoices SET total_amount = 17500000.00 WHERE invoice_number = 'INV-2024-001';
UPDATE invoices SET total_amount = 3000000.00 WHERE invoice_number = 'INV-2024-002';
UPDATE invoices SET total_amount = 1950000.00 WHERE invoice_number = 'INV-2024-003';
UPDATE invoices SET total_amount = 1000000.00 WHERE invoice_number = 'INV-2024-004';
UPDATE invoices SET total_amount = 3750000.00 WHERE invoice_number = 'INV-2024-005';
