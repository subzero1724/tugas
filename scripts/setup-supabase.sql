-- Complete Supabase Database Setup for Invoice Management System
-- Run this script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'pcs',
    base_price DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'cancelled')),
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price >= 0),
    line_total DECIMAL(15,2) NOT NULL CHECK (line_total >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_supplier ON invoices(supplier_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_product ON invoice_items(product_id);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update updated_at timestamps
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Clear existing data (if any)
DELETE FROM invoice_items;
DELETE FROM invoices;
DELETE FROM products;
DELETE FROM suppliers;

-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('SUP001', 'PT Elektronik Jaya', 'Jl. Sudirman No. 123, Jakarta', '021-12345678', 'info@elektronikjaya.com', 'Budi Santoso', 'active'),
('SUP002', 'CV Komputer Prima', 'Jl. Gatot Subroto No. 456, Bandung', '022-87654321', 'sales@komputerprima.com', 'Siti Rahayu', 'active'),
('SUP003', 'UD Teknologi Maju', 'Jl. Ahmad Yani No. 789, Surabaya', '031-11223344', 'contact@teknologimaju.com', 'Ahmad Wijaya', 'active'),
('SUP004', 'PT Digital Solutions', 'Jl. Diponegoro No. 321, Yogyakarta', '0274-55667788', 'info@digitalsolutions.com', 'Maya Sari', 'active'),
('SUP005', 'CV Hardware Center', 'Jl. Pahlawan No. 654, Medan', '061-99887766', 'sales@hardwarecenter.com', 'Rudi Hartono', 'active');

-- Insert sample products
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('PRD001', 'Laptop ASUS VivoBook', 'Electronics', 'pcs', 8500000.00, 'Laptop ASUS VivoBook 14 inch, RAM 8GB, SSD 512GB', 'active'),
('PRD002', 'Mouse Wireless Logitech', 'Electronics', 'pcs', 250000.00, 'Mouse wireless Logitech M705 dengan baterai tahan lama', 'active'),
('PRD003', 'Keyboard Mechanical', 'Electronics', 'pcs', 750000.00, 'Keyboard mechanical RGB dengan switch blue', 'active'),
('PRD004', 'Monitor LED 24 inch', 'Electronics', 'pcs', 2500000.00, 'Monitor LED 24 inch Full HD 1920x1080', 'active'),
('PRD005', 'Printer Canon Pixma', 'Electronics', 'pcs', 1200000.00, 'Printer Canon Pixma G2010 dengan sistem infus', 'active'),
('PRD006', 'Webcam HD Logitech', 'Electronics', 'pcs', 450000.00, 'Webcam Logitech C920 HD 1080p untuk video conference', 'active'),
('PRD007', 'Headset Gaming', 'Electronics', 'pcs', 350000.00, 'Headset gaming dengan microphone dan LED RGB', 'active'),
('PRD008', 'SSD External 1TB', 'Electronics', 'pcs', 1800000.00, 'SSD External 1TB USB 3.0 portable', 'active'),
('PRD009', 'Router WiFi TP-Link', 'Electronics', 'pcs', 650000.00, 'Router WiFi TP-Link AC1200 dual band', 'active'),
('PRD010', 'Power Bank 20000mAh', 'Electronics', 'pcs', 300000.00, 'Power Bank 20000mAh dengan fast charging', 'active');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by) VALUES
('INV-2024-001', (SELECT id FROM suppliers WHERE supplier_code = 'SUP001'), '2024-01-15', 17500000.00, 'paid', 'Pembelian laptop untuk kantor', 'admin'),
('INV-2024-002', (SELECT id FROM suppliers WHERE supplier_code = 'SUP002'), '2024-01-20', 3000000.00, 'approved', 'Pembelian peralatan komputer', 'admin'),
('INV-2024-003', (SELECT id FROM suppliers WHERE supplier_code = 'SUP003'), '2024-01-25', 1950000.00, 'pending', 'Pembelian printer dan webcam', 'admin'),
('INV-2024-004', (SELECT id FROM suppliers WHERE supplier_code = 'SUP004'), '2024-02-01', 1000000.00, 'draft', 'Pembelian headset gaming', 'admin'),
('INV-2024-005', (SELECT id FROM suppliers WHERE supplier_code = 'SUP005'), '2024-02-05', 3750000.00, 'paid', 'Pembelian router dan SSD', 'admin');

-- Insert sample invoice items
-- Invoice 1 items (INV-2024-001)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'PRD001'), 'PRD001', 'Laptop ASUS VivoBook', 2, 8500000.00, 17000000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'PRD002'), 'PRD002', 'Mouse Wireless Logitech', 2, 250000.00, 500000.00);

-- Invoice 2 items (INV-2024-002)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'PRD003'), 'PRD003', 'Keyboard Mechanical', 4, 750000.00, 3000000.00);

-- Invoice 3 items (INV-2024-003)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'PRD005'), 'PRD005', 'Printer Canon Pixma', 1, 1200000.00, 1200000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'PRD006'), 'PRD006', 'Webcam HD Logitech', 1, 450000.00, 450000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'PRD010'), 'PRD010', 'Power Bank 20000mAh', 1, 300000.00, 300000.00);

-- Invoice 4 items (INV-2024-004)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'PRD007'), 'PRD007', 'Headset Gaming', 2, 350000.00, 700000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'PRD010'), 'PRD010', 'Power Bank 20000mAh', 1, 300000.00, 300000.00);

-- Invoice 5 items (INV-2024-005)
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'PRD009'), 'PRD009', 'Router WiFi TP-Link', 3, 650000.00, 1950000.00),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'PRD008'), 'PRD008', 'SSD External 1TB', 1, 1800000.00, 1800000.00);

-- Display success message
SELECT 'Database setup completed successfully! Tables created and sample data inserted.' as message;
