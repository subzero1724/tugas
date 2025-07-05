-- Create Database for Invoice Management System
CREATE DATABASE IF NOT EXISTS invoice_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE invoice_management;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS suppliers;
