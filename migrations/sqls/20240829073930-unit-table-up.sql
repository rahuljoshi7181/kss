CREATE TABLE units (
    id INT AUTO_INCREMENT PRIMARY KEY,
    primary_unit VARCHAR(50) NOT NULL,    -- Name of the unit (e.g., KG, Ton, Nag)
    secondary_unit VARCHAR(50) NOT NULL, 
    primary_unit_hindi VARCHAR(50) NOT NULL, 
    secondary_unit_hindi VARCHAR(50) NOT NULL, 
    description VARCHAR(255) DEFAULT NULL, -- Optional description of the unit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);