-- Complete Supabase Database Setup Script
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
    created_by VARCHAR(255),
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
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
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

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('SUP001', 'PT Elektronik Jaya', 'Jl. Sudirman No. 123, Jakarta', '021-1234567', 'info@elektronikjaya.com', 'Budi Santoso', 'active'),
('SUP002', 'CV Komputer Prima', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321', 'sales@komputerprima.com', 'Siti Rahayu', 'active'),
('SUP003', 'UD Teknologi Maju', 'Jl. Ahmad Yani No. 789, Surabaya', '031-9876543', 'contact@teknologimaju.com', 'Ahmad Wijaya', 'active'),
('SUP004', 'PT Digital Solutions', 'Jl. Diponegoro No. 321, Yogyakarta', '0274-5555666', 'info@digitalsolutions.com', 'Maya Sari', 'active'),
('SUP005', 'CV Hardware Center', 'Jl. Pahlawan No. 654, Medan', '061-7777888', 'sales@hardwarecenter.com', 'Rudi Hartono', 'active')
ON CONFLICT (supplier_code) DO NOTHING;

-- Insert sample products
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('PRD001', 'Laptop ASUS VivoBook 14', 'Electronics', 'pcs', 7500000.00, 'Laptop dengan processor Intel Core i5, RAM 8GB, SSD 512GB', 'active'),
('PRD002', 'Mouse Wireless Logitech M705', 'Electronics', 'pcs', 450000.00, 'Mouse wireless dengan baterai tahan lama', 'active'),
('PRD003', 'Keyboard Mechanical Corsair K70', 'Electronics', 'pcs', 1200000.00, 'Keyboard mechanical gaming dengan backlight RGB', 'active'),
('PRD004', 'Monitor LED 24 inch Samsung', 'Electronics', 'pcs', 2500000.00, 'Monitor LED Full HD 1920x1080 dengan panel IPS', 'active'),
('PRD005', 'Printer Canon PIXMA G2010', 'Electronics', 'pcs', 1800000.00, 'Printer inkjet dengan sistem tinta infus', 'active'),
('PRD006', 'Webcam Logitech C920', 'Electronics', 'pcs', 1100000.00, 'Webcam HD 1080p untuk video conference', 'active'),
('PRD007', 'Speaker Bluetooth JBL Flip 5', 'Electronics', 'pcs', 1500000.00, 'Speaker portable dengan koneksi Bluetooth', 'active'),
('PRD008', 'Hard Disk External 1TB WD', 'Electronics', 'pcs', 850000.00, 'Hard disk eksternal USB 3.0 kapasitas 1TB', 'active'),
('PRD009', 'RAM DDR4 8GB Corsair', 'Electronics', 'pcs', 650000.00, 'Memory RAM DDR4 8GB untuk upgrade laptop/PC', 'active'),
('PRD010', 'SSD 256GB Samsung EVO', 'Electronics', 'pcs', 750000.00, 'Solid State Drive SATA 256GB untuk performa cepat', 'active')
ON CONFLICT (product_code) DO NOTHING;

-- Insert sample invoices with items
DO $$
DECLARE
    supplier1_id UUID;
    supplier2_id UUID;
    supplier3_id UUID;
    supplier4_id UUID;
    supplier5_id UUID;
    product1_id UUID;
    product2_id UUID;
    product3_id UUID;
    product4_id UUID;
    product5_id UUID;
    product6_id UUID;
    product7_id UUID;
    product8_id UUID;
    product9_id UUID;
    product10_id UUID;
    invoice1_id UUID;
    invoice2_id UUID;
    invoice3_id UUID;
    invoice4_id UUID;
    invoice5_id UUID;
BEGIN
    -- Get supplier IDs
    SELECT id INTO supplier1_id FROM suppliers WHERE supplier_code = 'SUP001';
    SELECT id INTO supplier2_id FROM suppliers WHERE supplier_code = 'SUP002';
    SELECT id INTO supplier3_id FROM suppliers WHERE supplier_code = 'SUP003';
    SELECT id INTO supplier4_id FROM suppliers WHERE supplier_code = 'SUP004';
    SELECT id INTO supplier5_id FROM suppliers WHERE supplier_code = 'SUP005';
    
    -- Get product IDs
    SELECT id INTO product1_id FROM products WHERE product_code = 'PRD001';
    SELECT id INTO product2_id FROM products WHERE product_code = 'PRD002';
    SELECT id INTO product3_id FROM products WHERE product_code = 'PRD003';
    SELECT id INTO product4_id FROM products WHERE product_code = 'PRD004';
    SELECT id INTO product5_id FROM products WHERE product_code = 'PRD005';
    SELECT id INTO product6_id FROM products WHERE product_code = 'PRD006';
    SELECT id INTO product7_id FROM products WHERE product_code = 'PRD007';
    SELECT id INTO product8_id FROM products WHERE product_code = 'PRD008';
    SELECT id INTO product9_id FROM products WHERE product_code = 'PRD009';
    SELECT id INTO product10_id FROM products WHERE product_code = 'PRD010';
    
    -- Insert Invoice 1 (only if it doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-001') THEN
        INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by)
        VALUES ('INV-2024-001', supplier1_id, '2024-01-15', 16400000.00, 'paid', 'Pembelian laptop dan aksesoris untuk kantor', 'admin')
        RETURNING id INTO invoice1_id;
        
        INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
        VALUES 
        (invoice1_id, product1_id, 'PRD001', 'Laptop ASUS VivoBook 14', 2, 7500000.00, 15000000.00),
        (invoice1_id, product2_id, 'PRD002', 'Mouse Wireless Logitech M705', 2, 450000.00, 900000.00),
        (invoice1_id, product3_id, 'PRD003', 'Keyboard Mechanical Corsair K70', 1, 1200000.00, 1200000.00),
        (invoice1_id, product9_id, 'PRD009', 'RAM DDR4 8GB Corsair', 2, 650000.00, 1300000.00);
    END IF;
    
    -- Insert Invoice 2 (only if it doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-002') THEN
        INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by)
        VALUES ('INV-2024-002', supplier2_id, '2024-01-20', 6300000.00, 'approved', 'Pembelian monitor dan printer', 'admin')
        RETURNING id INTO invoice2_id;
        
        INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
        VALUES 
        (invoice2_id, product4_id, 'PRD004', 'Monitor LED 24 inch Samsung', 2, 2500000.00, 5000000.00),
        (invoice2_id, product6_id, 'PRD006', 'Webcam Logitech C920', 1, 1100000.00, 1100000.00),
        (invoice2_id, product8_id, 'PRD008', 'Hard Disk External 1TB WD', 1, 850000.00, 850000.00);
    END IF;
    
    -- Insert Invoice 3 (only if it doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-003') THEN
        INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by)
        VALUES ('INV-2024-003', supplier3_id, '2024-01-25', 4050000.00, 'pending', 'Pembelian peralatan audio dan storage', 'admin')
        RETURNING id INTO invoice3_id;
        
        INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
        VALUES 
        (invoice3_id, product7_id, 'PRD007', 'Speaker Bluetooth JBL Flip 5', 2, 1500000.00, 3000000.00),
        (invoice3_id, product10_id, 'PRD010', 'SSD 256GB Samsung EVO', 1, 750000.00, 750000.00),
        (invoice3_id, product2_id, 'PRD002', 'Mouse Wireless Logitech M705', 1, 450000.00, 450000.00);
    END IF;
    
    -- Insert Invoice 4 (only if it doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-004') THEN
        INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by)
        VALUES ('INV-2024-004', supplier4_id, '2024-02-01', 3300000.00, 'draft', 'Pembelian printer dan aksesoris', 'admin')
        RETURNING id INTO invoice4_id;
        
        INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
        VALUES 
        (invoice4_id, product5_id, 'PRD005', 'Printer Canon PIXMA G2010', 1, 1800000.00, 1800000.00),
        (invoice4_id, product8_id, 'PRD008', 'Hard Disk External 1TB WD', 1, 850000.00, 850000.00),
        (invoice4_id, product9_id, 'PRD009', 'RAM DDR4 8GB Corsair', 1, 650000.00, 650000.00);
    END IF;
    
    -- Insert Invoice 5 (only if it doesn't exist)
    IF NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = 'INV-2024-005') THEN
        INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes, created_by)
        VALUES ('INV-2024-005', supplier5_id, '2024-02-05', 9950000.00, 'paid', 'Pembelian laptop dan upgrade components', 'admin')
        RETURNING id INTO invoice5_id;
        
        INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
        VALUES 
        (invoice5_id, product1_id, 'PRD001', 'Laptop ASUS VivoBook 14', 1, 7500000.00, 7500000.00),
        (invoice5_id, product3_id, 'PRD003', 'Keyboard Mechanical Corsair K70', 1, 1200000.00, 1200000.00),
        (invoice5_id, product6_id, 'PRD006', 'Webcam Logitech C920', 1, 1100000.00, 1100000.00),
        (invoice5_id, product8_id, 'PRD008', 'Hard Disk External 1TB WD', 1, 850000.00, 850000.00);
    END IF;
    
END $$;

-- Success message
SELECT 'Database setup completed successfully! Tables created and sample data inserted.' as result;
