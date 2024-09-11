CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fruit_category_id INT NOT NULL, 
    sold_quantity_primary DECIMAL(10, 2) DEFAULT 0, 
    sold_quantity_secondary DECIMAL(10, 2) DEFAULT 0, 
    sale_price DECIMAL(10, 2) NOT NULL, 
    sale_date DATE NOT NULL,  
    customer_id INT DEFAULT NULL,  
    user_id INT DEFAULT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,  
    updated_by INT DEFAULT NULL
);
