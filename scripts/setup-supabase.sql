-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;

-- Create suppliers table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Indonesia',
    tax_id VARCHAR(50),
    payment_terms INTEGER DEFAULT 30,
    credit_limit DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'pcs',
    unit_price DECIMAL(15,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    supplier_code VARCHAR(20),
    barcode VARCHAR(100),
    weight DECIMAL(10,3),
    dimensions VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (supplier_code) REFERENCES suppliers(supplier_code)
);

-- Create invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_code VARCHAR(20) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    payment_date DATE,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    notes TEXT,
    created_by VARCHAR(100) DEFAULT 'system',
    approved_by VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (supplier_code) REFERENCES suppliers(supplier_code)
);

-- Create invoice_items table
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_code) REFERENCES products(product_code)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_items_updated_at BEFORE UPDATE ON invoice_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample suppliers
INSERT INTO suppliers (supplier_code, supplier_name, contact_person, phone, email, address, city) VALUES
('SUP001', 'PT Elektronik Jaya', 'Budi Santoso', '021-1234567', 'budi@elektronikjaya.com', 'Jl. Sudirman No. 123', 'Jakarta'),
('SUP002', 'CV Komputer Prima', 'Siti Rahayu', '021-2345678', 'siti@komputerprima.com', 'Jl. Thamrin No. 456', 'Jakarta'),
('SUP003', 'UD Peralatan Kantor', 'Ahmad Wijaya', '021-3456789', 'ahmad@peralatankantor.com', 'Jl. Gatot Subroto No. 789', 'Jakarta'),
('SUP004', 'PT Teknologi Maju', 'Rina Sari', '021-4567890', 'rina@teknologimaju.com', 'Jl. Kuningan No. 321', 'Jakarta'),
('SUP005', 'CV Solusi Digital', 'Dedi Kurniawan', '021-5678901', 'dedi@solusidigital.com', 'Jl. Senayan No. 654', 'Jakarta'),
('Sg01', 'Topyota', 'Toyota Sales', '021-6789012', 'sales@topyota.com', 'Jl. Toyota No. 987', 'Jakarta');

-- Insert sample products
INSERT INTO products (product_code, product_name, description, category, unit, unit_price, stock_quantity, supplier_code) VALUES
('LAPTOP001', 'Laptop Dell Inspiron 15', 'Laptop Dell Inspiron 15 inch, Intel i5, 8GB RAM, 512GB SSD', 'Komputer', 'unit', 8500000, 10, 'SUP001'),
('MOUSE001', 'Mouse Wireless Logitech', 'Mouse wireless Logitech M705, 2.4GHz', 'Aksesoris', 'unit', 350000, 50, 'SUP002'),
('KEYBOARD001', 'Keyboard Mechanical', 'Keyboard mechanical RGB, switch blue', 'Aksesoris', 'unit', 750000, 25, 'SUP002'),
('MONITOR001', 'Monitor LED 24 inch', 'Monitor LED 24 inch Full HD, HDMI, VGA', 'Komputer', 'unit', 2200000, 15, 'SUP001'),
('PRINTER001', 'Printer Inkjet Canon', 'Printer inkjet Canon PIXMA, print, scan, copy', 'Peralatan', 'unit', 1800000, 8, 'SUP003'),
('CHAIR001', 'Kursi Kantor Ergonomis', 'Kursi kantor ergonomis, adjustable height', 'Furniture', 'unit', 1500000, 20, 'SUP003'),
('DESK001', 'Meja Kantor Kayu', 'Meja kantor kayu solid, 120x60cm', 'Furniture', 'unit', 2500000, 12, 'SUP003'),
('ROUTER001', 'Router WiFi AC1200', 'Router WiFi dual band AC1200, 4 port LAN', 'Networking', 'unit', 650000, 30, 'SUP004'),
('SWITCH001', 'Switch 24 Port Gigabit', 'Switch managed 24 port gigabit ethernet', 'Networking', 'unit', 3200000, 5, 'SUP004'),
('TABLET001', 'Tablet Android 10 inch', 'Tablet Android 10 inch, 4GB RAM, 64GB storage', 'Mobile', 'unit', 2800000, 18, 'SUP005'),
('S21', 'ra', 'Sample product ra', 'Sample', 'unit', 20, 100, 'Sg01');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, supplier_code, invoice_date, total_amount, status, notes, created_by) VALUES
('INV-2024-001', 'SUP001', '2024-01-15', 19400000, 'approved', 'Pembelian laptop dan monitor untuk kantor', 'admin'),
('INV-2024-002', 'SUP002', '2024-01-16', 2200000, 'pending', 'Pembelian aksesoris komputer', 'admin'),
('INV-2024-003', 'SUP003', '2024-01-17', 5300000, 'approved', 'Pembelian furniture kantor', 'admin'),
('INV-2024-004', 'SUP004', '2024-01-18', 3850000, 'pending', 'Pembelian peralatan networking', 'admin'),
('INV-2024-005', 'SUP005', '2024-01-19', 5600000, 'approved', 'Pembelian tablet untuk presentasi', 'admin');

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_code, quantity, unit_price, line_total) VALUES
-- Invoice 1 items
(1, 'LAPTOP001', 2, 8500000, 17000000),
(1, 'MONITOR001', 1, 2200000, 2200000),
(1, 'MOUSE001', 1, 350000, 350000),

-- Invoice 2 items  
(2, 'KEYBOARD001', 2, 750000, 1500000),
(2, 'MOUSE001', 2, 350000, 700000),

-- Invoice 3 items
(3, 'CHAIR001', 2, 1500000, 3000000),
(3, 'DESK001', 1, 2500000, 2500000),

-- Invoice 4 items
(4, 'ROUTER001', 1, 650000, 650000),
(4, 'SWITCH001', 1, 3200000, 3200000),

-- Invoice 5 items
(5, 'TABLET001', 2, 2800000, 5600000);

-- Create indexes for better performance
CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_supplier ON invoices(supplier_code);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_product_code ON invoice_items(product_code);

-- Create views for reporting
CREATE VIEW invoice_summary AS
SELECT 
    i.id,
    i.invoice_number,
    i.invoice_date,
    i.supplier_code,
    s.supplier_name,
    i.total_amount,
    i.status,
    i.payment_status,
    COUNT(ii.id) as item_count,
    SUM(ii.quantity) as total_quantity
FROM invoices i
LEFT JOIN suppliers s ON i.supplier_code = s.supplier_code
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
GROUP BY i.id, i.invoice_number, i.invoice_date, i.supplier_code, s.supplier_name, i.total_amount, i.status, i.payment_status;

SELECT 'Database setup completed successfully!' as message;
