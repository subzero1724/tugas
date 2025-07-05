-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'cancelled')),
    notes TEXT,
    created_by VARCHAR(100),
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

-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, supplier_name, address, phone, email, contact_person, status) VALUES
('S001', 'PT Elektronik Jaya', 'Jl. Sudirman No. 123, Jakarta', '021-1234567', 'info@elektronikjaya.com', 'Budi Santoso', 'active'),
('S002', 'CV Komputer Prima', 'Jl. Gatot Subroto No. 456, Bandung', '022-7654321', 'sales@komputerprima.com', 'Siti Rahayu', 'active'),
('S003', 'UD Teknologi Maju', 'Jl. Ahmad Yani No. 789, Surabaya', '031-9876543', 'order@teknologimaju.com', 'Ahmad Wijaya', 'active'),
('S004', 'PT Global Elektronik', 'Jl. Diponegoro No. 321, Medan', '061-5432109', 'purchasing@globalelektronik.com', 'Rina Sari', 'active'),
('S005', 'CV Digital Solutions', 'Jl. Pahlawan No. 654, Yogyakarta', '0274-8765432', 'info@digitalsolutions.com', 'Dedi Kurniawan', 'active')
ON CONFLICT (supplier_code) DO NOTHING;

-- Insert sample products
INSERT INTO products (product_code, product_name, category, unit, base_price, description, status) VALUES
('P001', 'Laptop ASUS VivoBook 14', 'Electronics', 'pcs', 7500000, 'Laptop dengan processor Intel Core i5, RAM 8GB, SSD 512GB', 'active'),
('P002', 'Mouse Wireless Logitech M705', 'Electronics', 'pcs', 450000, 'Mouse wireless dengan baterai tahan lama', 'active'),
('P003', 'Keyboard Mechanical Corsair K70', 'Electronics', 'pcs', 1200000, 'Keyboard mechanical gaming dengan backlight RGB', 'active'),
('P004', 'Monitor LED 24 inch Samsung', 'Electronics', 'pcs', 2500000, 'Monitor LED 24 inch Full HD dengan teknologi VA panel', 'active'),
('P005', 'Printer Canon PIXMA G2010', 'Electronics', 'pcs', 1800000, 'Printer inkjet dengan sistem tangki tinta', 'active'),
('P006', 'Webcam Logitech C920', 'Electronics', 'pcs', 1100000, 'Webcam HD 1080p untuk video conference', 'active'),
('P007', 'Speaker Bluetooth JBL Flip 5', 'Electronics', 'pcs', 1500000, 'Speaker portable dengan koneksi Bluetooth', 'active'),
('P008', 'Hard Disk External 1TB WD', 'Electronics', 'pcs', 850000, 'Hard disk eksternal kapasitas 1TB USB 3.0', 'active'),
('P009', 'Power Bank Xiaomi 20000mAh', 'Electronics', 'pcs', 350000, 'Power bank dengan kapasitas 20000mAh fast charging', 'active'),
('P010', 'Cable HDMI 2m Belkin', 'Electronics', 'pcs', 150000, 'Kabel HDMI panjang 2 meter untuk koneksi display', 'active')
ON CONFLICT (product_code) DO NOTHING;

-- Insert sample invoices
INSERT INTO invoices (invoice_number, supplier_id, invoice_date, subtotal, tax_amount, discount_amount, total_amount, status, notes, created_by) VALUES
('INV-2024-001', (SELECT id FROM suppliers WHERE supplier_code = 'S001'), '2024-01-15', 15000000, 1500000, 0, 16500000, 'paid', 'Pembelian laptop untuk kantor', 'admin'),
('INV-2024-002', (SELECT id FROM suppliers WHERE supplier_code = 'S002'), '2024-01-20', 3200000, 320000, 100000, 3420000, 'approved', 'Pembelian aksesoris komputer', 'admin'),
('INV-2024-003', (SELECT id FROM suppliers WHERE supplier_code = 'S003'), '2024-02-01', 5500000, 550000, 0, 6050000, 'pending', 'Pembelian peralatan IT', 'admin'),
('INV-2024-004', (SELECT id FROM suppliers WHERE supplier_code = 'S004'), '2024-02-10', 2800000, 280000, 200000, 2880000, 'draft', 'Pembelian printer dan scanner', 'admin'),
('INV-2024-005', (SELECT id FROM suppliers WHERE supplier_code = 'S005'), '2024-02-15', 4200000, 420000, 0, 4620000, 'paid', 'Pembelian perangkat audio visual', 'admin')
ON CONFLICT (invoice_number) DO NOTHING;

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total) VALUES
-- Items for INV-2024-001
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), (SELECT id FROM products WHERE product_code = 'P001'), 'P001', 'Laptop ASUS VivoBook 14', 2, 7500000, 15000000),

-- Items for INV-2024-002
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'P002'), 'P002', 'Mouse Wireless Logitech M705', 4, 450000, 1800000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'P003'), 'P003', 'Keyboard Mechanical Corsair K70', 1, 1200000, 1200000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), (SELECT id FROM products WHERE product_code = 'P010'), 'P010', 'Cable HDMI 2m Belkin', 1, 150000, 150000),

-- Items for INV-2024-003
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'P004'), 'P004', 'Monitor LED 24 inch Samsung', 2, 2500000, 5000000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), (SELECT id FROM products WHERE product_code = 'P008'), 'P008', 'Hard Disk External 1TB WD', 1, 850000, 850000),

-- Items for INV-2024-004
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'P005'), 'P005', 'Printer Canon PIXMA G2010', 1, 1800000, 1800000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), (SELECT id FROM products WHERE product_code = 'P006'), 'P006', 'Webcam Logitech C920', 1, 1100000, 1100000),

-- Items for INV-2024-005
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'P007'), 'P007', 'Speaker Bluetooth JBL Flip 5', 2, 1500000, 3000000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), (SELECT id FROM products WHERE product_code = 'P009'), 'P009', 'Power Bank Xiaomi 20000mAh', 3, 350000, 1050000);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

SELECT 'Database setup completed successfully!' as message;
