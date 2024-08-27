CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    fruit_id int(11) DEFAULT NULL,
    business_type ENUM('Street Seller', 'Local Vendor', 'Other') NOT NULL,
    potential_volume DECIMAL(10, 2) DEFAULT NULL,
    lead_status ENUM('New', 'Contacted', 'Interested', 'Not Interested', 'Converted') DEFAULT 'New',
    notes TEXT DEFAULT NULL,
    source VARCHAR(255) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
