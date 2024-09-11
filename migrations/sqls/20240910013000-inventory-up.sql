CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fruit_category_id INT NOT NULL,  
    primary_quantity DECIMAL(10, 2), 
    secondary_quantity DECIMAL(10, 2), 
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    source INT NOT NULL, 
    type TINYINT NOT NULL,
    warehouse_location TEXT DEFAULT NULL, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    created_by INT NOT NULL,  
    updated_by INT DEFAULT NULL
);
