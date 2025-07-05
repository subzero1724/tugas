USE invoice_management;

DELIMITER //

-- Stored Procedure: Create new invoice
CREATE PROCEDURE CreateInvoice(
    IN p_invoice_number VARCHAR(50),
    IN p_supplier_code VARCHAR(10),
    IN p_invoice_date DATE,
    IN p_created_by VARCHAR(100),
    OUT p_invoice_id INT
)
BEGIN
    DECLARE v_supplier_id INT;
    
    -- Get supplier ID
    SELECT id INTO v_supplier_id 
    FROM suppliers 
    WHERE supplier_code = p_supplier_code AND status = 'active';
    
    IF v_supplier_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Supplier not found or inactive';
    END IF;
    
    -- Insert invoice
    INSERT INTO invoices (invoice_number, supplier_id, invoice_date, created_by)
    VALUES (p_invoice_number, v_supplier_id, p_invoice_date, p_created_by);
    
    SET p_invoice_id = LAST_INSERT_ID();
END//

-- Stored Procedure: Add invoice item
CREATE PROCEDURE AddInvoiceItem(
    IN p_invoice_id INT,
    IN p_product_code VARCHAR(20),
    IN p_quantity INT,
    IN p_unit_price DECIMAL(15,2)
)
BEGIN
    DECLARE v_product_id INT;
    DECLARE v_product_name VARCHAR(200);
    DECLARE v_line_total DECIMAL(15,2);
    
    -- Get product information
    SELECT id, product_name INTO v_product_id, v_product_name
    FROM products 
    WHERE product_code = p_product_code AND status = 'active';
    
    IF v_product_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found or inactive';
    END IF;
    
    -- Calculate line total
    SET v_line_total = p_quantity * p_unit_price;
    
    -- Insert invoice item
    INSERT INTO invoice_items (invoice_id, product_id, product_code, product_name, quantity, unit_price, line_total)
    VALUES (p_invoice_id, v_product_id, p_product_code, v_product_name, p_quantity, p_unit_price, v_line_total);
END//

-- Stored Procedure: Get invoice report
CREATE PROCEDURE GetInvoiceReport(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_supplier_code VARCHAR(10)
)
BEGIN
    SELECT 
        i.invoice_number,
        i.invoice_date,
        s.supplier_code,
        s.supplier_name,
        i.total_amount,
        i.status,
        COUNT(ii.id) as item_count,
        SUM(ii.quantity) as total_quantity
    FROM invoices i
    JOIN suppliers s ON i.supplier_id = s.id
    LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
    WHERE i.invoice_date BETWEEN p_start_date AND p_end_date
    AND (p_supplier_code IS NULL OR s.supplier_code = p_supplier_code)
    GROUP BY i.id, i.invoice_number, i.invoice_date, s.supplier_code, s.supplier_name, i.total_amount, i.status
    ORDER BY i.invoice_date DESC;
END//

DELIMITER ;
