-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;

-- Drop existing functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    contact_person VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'cancelled')),
    notes TEXT,
    created_by VARCHAR(100) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL DEFAULT 0,
    notes TEXT,
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

-- Insert sample suppliers (including the ones you need)
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('S01', 'PT Elektronik Jaya', 'Jl. Sudirman No. 123, Jakarta', '021-1234567', 'info@elektronikjaya.com', 'Budi Santoso', 'active'),
('G01', 'CV Global Nusantara', 'Jl. Gatot Subroto No. 456, Jakarta', '021-7654321', 'sales@globalnusantara.com', 'Siti Rahayu', 'active'),
('Sg01', 'Topyota', 'Jl. Asia Afrika No. 789, Bandung', '022-1111111', 'contact@topyota.com', 'Ahmad Wijaya', 'active'),
('H01', 'Hitachi Indonesia', 'Jl. Thamrin No. 321, Jakarta', '021-9999999', 'sales@hitachi.co.id', 'Tanaka San', 'active'),
('M01', 'CV Maju Bersama', 'Jl. Diponegoro No. 654, Surabaya', '031-2222222', 'info@majubersama.com', 'Rina Sari', 'active')
ON CONFLICT (supplier_code) DO NOTHING;

-- Insert sample products (including the ones you need)
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('S01', 'RICE COOKER CC3', 'Electronics', 'pcs', 1500000, 'Rice cooker 3 liter capacity', 'active'),
('S21', 'ra', 'Electronics', 'pcs', 20, 'Sample product ra', 'active'),
('L01', 'Laptop ASUS X441', 'Electronics', 'pcs', 5500000, 'Laptop ASUS X441 Core i3', 'active'),
('M01', 'Mouse Wireless', 'Electronics', 'pcs', 150000, 'Wireless optical mouse', 'active'),
('K01', 'Keyboard Mechanical', 'Electronics', 'pcs', 750000, 'Mechanical gaming keyboard', 'active'),
('P01', 'Printer Canon', 'Electronics', 'pcs', 2500000, 'Canon inkjet printer', 'active'),
('H01', 'Hard Disk 1TB', 'Electronics', 'pcs', 850000, 'External hard disk 1TB', 'active'),
('R01', 'RAM 8GB DDR4', 'Electronics', 'pcs', 650000, 'DDR4 8GB memory module', 'active'),
('C01', 'Cable HDMI', 'Electronics', 'pcs', 75000, 'HDMI cable 2 meter', 'active'),
('U01', 'USB Flash Drive 32GB', 'Electronics', 'pcs', 125000, 'USB 3.0 flash drive 32GB', 'active')
ON CONFLICT (product_code) DO NOTHING;

-- Insert sample invoices
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, total_amount, status, notes) VALUES
('INV-001', (SELECT id FROM suppliers WHERE supplier_code = 'S01'), '2024-01-15', 3000000, 'paid', 'Pembelian rice cooker'),
('INV-002', (SELECT id FROM suppliers WHERE supplier_code = 'G01'), '2024-01-20', 5500000, 'pending', 'Pembelian laptop'),
('INV-003', (SELECT id FROM suppliers WHERE supplier_code = 'Sg01'), '2024-01-25', 900000, 'approved', 'Pembelian aksesoris'),
('INV-004', (SELECT id FROM suppliers WHERE supplier_code = 'H01'), '2024-02-01', 2500000, 'pending', 'Pembelian printer'),
('INV-005', (SELECT id FROM suppliers WHERE supplier_code = 'M01'), '2024-02-05', 1500000, 'paid', 'Pembelian storage')
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
-- Items for INV-001
((SELECT id FROM invoices WHERE invoice_number = 'INV-001'), (SELECT id FROM products WHERE product_code = 'S01'), 'S01', 'RICE COOKER CC3', 2, 1500000, 3000000),

-- Items for INV-002
((SELECT id FROM invoices WHERE invoice_number = 'INV-002'), (SELECT id FROM products WHERE product_code = 'L01'), 'L01', 'Laptop ASUS X441', 1, 5500000, 5500000),

-- Items for INV-003
((SELECT id FROM invoices WHERE invoice_number = 'INV-003'), (SELECT id FROM products WHERE product_code = 'M01'), 'M01', 'Mouse Wireless', 2, 150000, 300000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-003'), (SELECT id FROM products WHERE product_code = 'K01'), 'K01', 'Keyboard Mechanical', 1, 750000, 750000),

-- Items for INV-004
((SELECT id FROM invoices WHERE invoice_number = 'INV-004'), (SELECT id FROM products WHERE product_code = 'P01'), 'P01', 'Printer Canon', 1, 2500000, 2500000),

-- Items for INV-005
((SELECT id FROM invoices WHERE invoice_number = 'INV-005'), (SELECT id FROM products WHERE product_code = 'H01'), 'H01', 'Hard Disk 1TB', 1, 850000, 850000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-005'), (SELECT id FROM products WHERE product_code = 'R01'), 'R01', 'RAM 8GB DDR4', 1, 650000, 650000);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

SELECT 'Database setup completed successfully!' as message;
