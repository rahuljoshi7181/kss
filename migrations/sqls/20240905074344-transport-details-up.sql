CREATE TABLE transport (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transporter_company_name VARCHAR(100) NOT NULL, 
    route TEXT,  
    route_start VARCHAR(100),  
    route_end VARCHAR(100),  
    office_address TEXT, 
    contact_number VARCHAR(15),  
    notes TEXT, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
);