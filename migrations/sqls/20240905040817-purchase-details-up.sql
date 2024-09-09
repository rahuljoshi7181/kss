CREATE TABLE purchase_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fruit_category_id INT NOT NULL,  
    price DECIMAL(10, 2) NOT NULL, 
    user_id INT NOT NULL,  
    order_date DATE NOT NULL,  
    deliver_date DATE, 
    primary_quantity DECIMAL(10, 2), 
    secondary_quantity DECIMAL(10, 2),  -- Missing comma added here
    transport_id INT DEFAULT NULL,  
    city_id INT NOT NULL,  
    address TEXT DEFAULT NULL,  
    notes TEXT DEFAULT NULL, 
    bill_number VARCHAR(50) DEFAULT NULL,  
    bill TEXT DEFAULT NULL,  
    total_costing DECIMAL(10, 2) DEFAULT NULL,  
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    created_by INT NOT NULL,  
    updated_by INT DEFAULT NULL  
);
