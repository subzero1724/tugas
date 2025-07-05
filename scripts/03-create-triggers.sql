USE invoice_management;

-- Trigger to automatically update invoice total when items are added/updated/deleted
DELIMITER //

CREATE TRIGGER update_invoice_total_after_insert
AFTER INSERT ON invoice_items
FOR EACH ROW
BEGIN
    UPDATE invoices 
    SET subtotal = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM invoice_items 
        WHERE invoice_id = NEW.invoice_id
    ),
    total_amount = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM invoice_items 
        WHERE invoice_id = NEW.invoice_id
    ) + tax_amount - discount_amount
    WHERE id = NEW.invoice_id;
END//

CREATE TRIGGER update_invoice_total_after_update
AFTER UPDATE ON invoice_items
FOR EACH ROW
BEGIN
    UPDATE invoices 
    SET subtotal = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM invoice_items 
        WHERE invoice_id = NEW.invoice_id
    ),
    total_amount = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM invoice_items 
        WHERE invoice_id = NEW.invoice_id
    ) + tax_amount - discount_amount
    WHERE id = NEW.invoice_id;
END//

CREATE TRIGGER update_invoice_total_after_delete
AFTER DELETE ON invoice_items
FOR EACH ROW
BEGIN
    UPDATE invoices 
    SET subtotal = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM invoice_items 
        WHERE invoice_id = OLD.invoice_id
    ),
    total_amount = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM invoice_items 
        WHERE invoice_id = OLD.invoice_id
    ) + tax_amount - discount_amount
    WHERE id = OLD.invoice_id;
END//

DELIMITER ;
