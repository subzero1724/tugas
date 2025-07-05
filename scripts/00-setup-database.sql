-- Complete Database Setup Script
-- Run this first to create the database and user

-- Create database
DROP DATABASE IF EXISTS invoice_management;
CREATE DATABASE invoice_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user (optional - for security)
-- CREATE USER IF NOT EXISTS 'invoice_user'@'localhost' IDENTIFIED BY 'invoice_password';
-- GRANT ALL PRIVILEGES ON invoice_management.* TO 'invoice_user'@'localhost';
-- FLUSH PRIVILEGES;

USE invoice_management;
