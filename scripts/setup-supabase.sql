-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(20) DEFAULT 'pcs',
    price DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(10) NOT NULL REFERENCES suppliers(code),
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supplier_code, invoice_number)
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_code VARCHAR(20) NOT NULL REFERENCES products(code),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(15,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample suppliers
INSERT INTO suppliers (code, name, address, phone, email, contact_person) VALUES
('S001', 'PT Elektronik Jaya', 'Jl. Sudirman No. 123, Jakarta', '021-1234567', 'info@elektronikjaya.com', 'Budi Santoso'),
('S002', 'CV Komputer Prima', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321', 'sales@komputerprima.com', 'Siti Nurhaliza'),
('S003', 'UD Teknologi Maju', 'Jl. Ahmad Yani No. 789, Surabaya', '031-9876543', 'contact@teknologimaju.com', 'Ahmad Rahman'),
('S004', 'PT Digital Solutions', 'Jl. Thamrin No. 321, Jakarta', '021-5555666', 'info@digitalsolutions.com', 'Maya Sari'),
('S005', 'CV Hardware Center', 'Jl. Diponegoro No. 654, Yogyakarta', '0274-888999', 'sales@hardwarecenter.com', 'Joko Widodo'),
('Sg01', 'Topyota', 'Jl. Merdeka No. 100, Jakarta', '021-1111222', 'info@topyota.com', 'Toyota Admin')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    contact_person = EXCLUDED.contact_person;

-- Insert sample products
INSERT INTO products (code, name, description, unit, price) VALUES
('P001', 'Laptop ASUS VivoBook', 'Laptop ASUS VivoBook 14 inch, RAM 8GB, SSD 512GB', 'unit', 7500000.00),
('P002', 'Mouse Wireless Logitech', 'Mouse wireless Logitech M705, ergonomic design', 'unit', 450000.00),
('P003', 'Keyboard Mechanical', 'Keyboard mechanical RGB backlight, Cherry MX switches', 'unit', 850000.00),
('P004', 'Monitor LED 24 inch', 'Monitor LED 24 inch Full HD, IPS panel', 'unit', 2200000.00),
('P005', 'Printer Canon Pixma', 'Printer Canon Pixma G2010, ink tank system', 'unit', 1800000.00),
('P006', 'Webcam Logitech C920', 'Webcam Logitech C920 HD Pro, 1080p recording', 'unit', 1200000.00),
('P007', 'Headset Gaming', 'Headset gaming dengan microphone, surround sound', 'unit', 650000.00),
('P008', 'SSD External 1TB', 'SSD External 1TB, USB 3.0, portable', 'unit', 1500000.00),
('P009', 'Router WiFi 6', 'Router WiFi 6 dual band, speed up to 1200Mbps', 'unit', 950000.00),
('P010', 'UPS 650VA', 'UPS 650VA dengan battery backup, surge protection', 'unit', 750000.00),
('S01', 'Spare Part A', 'Generic spare part A for automotive', 'pcs', 19997.00),
('S21', 'ra', 'Product ra description', 'pcs', 20.00)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    unit = EXCLUDED.unit,
    price = EXCLUDED.price;

-- Insert sample invoices
INSERT INTO invoices (supplier_code, invoice_number, invoice_date, total_amount, status, notes) VALUES
('S001', 'INV-2024-001', '2024-01-15', 8400000.00, 'paid', 'Pembelian laptop dan aksesoris'),
('S002', 'INV-2024-002', '2024-01-20', 3050000.00, 'pending', 'Pembelian monitor dan keyboard'),
('S003', 'INV-2024-003', '2024-01-25', 2450000.00, 'paid', 'Pembelian printer dan webcam'),
('S004', 'INV-2024-004', '2024-02-01', 1600000.00, 'pending', 'Pembelian headset dan SSD'),
('S005', 'INV-2024-005', '2024-02-05', 1700000.00, 'paid', 'Pembelian router dan UPS')
ON CONFLICT (supplier_code, invoice_number) DO NOTHING;

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P001',
    1,
    7500000.00,
    7500000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-001' AND i.supplier_code = 'S001'
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P002',
    2,
    450000.00,
    900000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-001' AND i.supplier_code = 'S001'
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P004',
    1,
    2200000.00,
    2200000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-002' AND i.supplier_code = 'S002'
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P003',
    1,
    850000.00,
    850000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-002' AND i.supplier_code = 'S002'
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P005',
    1,
    1800000.00,
    1800000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-003' AND i.supplier_code = 'S003'
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P006',
    1,
    1200000.00,
    1200000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-004' AND i.supplier_code = 'S004'
ON CONFLICT DO NOTHING;

INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, total_price)
SELECT 
    i.id,
    'P008',
    1,
    1500000.00,
    1500000.00
FROM invoices i WHERE i.invoice_number = 'INV-2024-005' AND i.supplier_code = 'S005'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_supplier_code ON invoices(supplier_code);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product_code ON invoice_items(product_code);

SELECT 'Database setup completed successfully!' as message;
