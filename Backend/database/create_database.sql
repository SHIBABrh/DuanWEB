-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS realestatedb;

-- Use the database
USE realestatedb;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    dob DATE NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    address VARCHAR(255) NULL,
    avatar LONGBLOB NULL,
    registration_date DATETIME NOT NULL,
    updated_at DATETIME NULL,
    UNIQUE INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
);

-- Add sample data if the table is empty
INSERT INTO users (id, full_name, email, phone, role, status, address, registration_date, password)
SELECT 'UID001', 'Nguyễn Văn A', 'nguyenvana@example.com', '0123456789', 'ADMIN', 'ACTIVE', 
        '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh', NOW(), '$2a$10$qBgPvjUB7jQX5J3loC2bKe5fj9FdEjAyFBbqnUIkHJPOaqRCIQmS2'
WHERE NOT EXISTS (SELECT * FROM users WHERE id = 'UID001');

INSERT INTO users (id, full_name, email, phone, role, status, address, registration_date, password)
SELECT 'UID002', 'Trần Thị B', 'tranthib@example.com', '0234567890', 'MANAGER', 'ACTIVE', 
        '456 Đường DEF, Quận UVW, TP. Hồ Chí Minh', NOW(), '$2a$10$qBgPvjUB7jQX5J3loC2bKe5fj9FdEjAyFBbqnUIkHJPOaqRCIQmS2'
WHERE NOT EXISTS (SELECT * FROM users WHERE id = 'UID002');

INSERT INTO users (id, full_name, email, phone, role, status, address, registration_date, password)
SELECT 'UID003', 'Lê Văn C', 'levanc@example.com', '0345678901', 'AGENT', 'INACTIVE', 
        '789 Đường GHI, Quận JKL, TP. Hồ Chí Minh', NOW(), '$2a$10$qBgPvjUB7jQX5J3loC2bKe5fj9FdEjAyFBbqnUIkHJPOaqRCIQmS2'
WHERE NOT EXISTS (SELECT * FROM users WHERE id = 'UID003');

INSERT INTO users (id, full_name, email, phone, role, status, address, registration_date, password)
SELECT 'UID004', 'Phạm Thị D', 'phamthid@example.com', '0456789012', 'CLIENT', 'ACTIVE', 
        '101 Đường MNO, Quận PQR, TP. Hồ Chí Minh', NOW(), '$2a$10$qBgPvjUB7jQX5J3loC2bKe5fj9FdEjAyFBbqnUIkHJPOaqRCIQmS2'
WHERE NOT EXISTS (SELECT * FROM users WHERE id = 'UID004');

INSERT INTO users (id, full_name, email, phone, role, status, address, registration_date, password)
SELECT 'UID005', 'Hoàng Văn E', 'hoangvane@example.com', '0567890123', 'CLIENT', 'PENDING', 
        '202 Đường STU, Quận VWX, TP. Hồ Chí Minh', NOW(), '$2a$10$qBgPvjUB7jQX5J3loC2bKe5fj9FdEjAyFBbqnUIkHJPOaqRCIQmS2'
WHERE NOT EXISTS (SELECT * FROM users WHERE id = 'UID005'); 