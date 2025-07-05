-- Drop existing triggers first to avoid conflicts
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'cancelled')),
    notes TEXT,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clear existing data
DELETE FROM invoice_items;
DELETE FROM invoices;
DELETE FROM products;
DELETE FROM suppliers;

-- Insert sample suppliers (including Sg01 that you're using)
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('Sg01', 'Topyota', 'Jl. Industri No. 123, Jakarta', '021-1234567', 'contact@topyota.com', 'John Doe', 'active'),
('S01', 'PT Elektronik Jaya', 'Jl. Sudirman No. 45, Jakarta', '021-5551234', 'info@elektronikjaya.com', 'Ahmad Wijaya', 'active'),
('S02', 'CV Komputer Prima', 'Jl. Gatot Subroto No. 78, Bandung', '022-7778888', 'sales@komputerprima.com', 'Siti Nurhaliza', 'active'),
('S03', 'UD Teknologi Maju', 'Jl. Diponegoro No. 12, Surabaya', '031-9990000', 'admin@teknologimaju.com', 'Budi Santoso', 'active'),
('S04', 'PT Digital Solutions', 'Jl. Thamrin No. 56, Jakarta', '021-3334444', 'contact@digitalsolutions.com', 'Lisa Permata', 'active');

-- Insert sample products (including S21 that you're using)
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('S21', 'ra', 'Electronics', 'pcs', 20, 'Sample product ra', 'active'),
('P001', 'Laptop Dell Inspiron 15', 'Electronics', 'pcs', 8500000, 'Laptop Dell Inspiron 15 3000 Series', 'active'),
('P002', 'Mouse Wireless Logitech', 'Electronics', 'pcs', 250000, 'Mouse wireless Logitech M705', 'active'),
('P003', 'Keyboard Mechanical', 'Electronics', 'pcs', 750000, 'Keyboard mechanical RGB backlight', 'active'),
('P004', 'Monitor LED 24 inch', 'Electronics', 'pcs', 2500000, 'Monitor LED 24 inch Full HD', 'active'),
('P005', 'Printer Canon Pixma', 'Electronics', 'pcs', 1200000, 'Printer Canon Pixma G2010', 'active'),
('P006', 'Webcam HD 1080p', 'Electronics', 'pcs', 450000, 'Webcam HD 1080p with microphone', 'active'),
('P007', 'Speaker Bluetooth', 'Electronics', 'pcs', 350000, 'Speaker Bluetooth portable', 'active'),
('P008', 'Hard Drive External 1TB', 'Electronics', 'pcs', 850000, 'Hard Drive External 1TB USB 3.0', 'active'),
('P009', 'RAM DDR4 8GB', 'Electronics', 'pcs', 650000, 'RAM DDR4 8GB 2400MHz', 'active'),
('P010', 'SSD 256GB', 'Electronics', 'pcs', 750000, 'SSD SATA 256GB', 'active');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, subtotal, tax_amount, discount_amount, total_amount, status, notes, created_by) 
VALUES 
('INV-001', (SELECT id FROM suppliers WHERE supplier_code = 'S01'), '2024-01-15', 8500000, 0, 0, 8500000, 'paid', 'Pembelian laptop untuk kantor', 'admin'),
('INV-002', (SELECT id FROM suppliers WHERE supplier_code = 'S02'), '2024-01-20', 1000000, 0, 0, 1000000, 'approved', 'Pembelian aksesoris komputer', 'admin');

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
VALUES 
((SELECT id FROM invoices WHERE invoice_number = 'INV-001'), (SELECT id FROM products WHERE product_code = 'P001'), 'P001', 'Laptop Dell Inspiron 15', 1, 8500000, 8500000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), (SELECT id FROM products WHERE product_code = 'P002'), 'P002', 'Mouse Wireless Logitech', 2, 250000, 500000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), (SELECT id FROM products WHERE product_code = 'P003'), 'P003', 'Keyboard Mechanical', 1, 750000, 750000);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers (after dropping existing ones)
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Database setup completed successfully!' as message;
