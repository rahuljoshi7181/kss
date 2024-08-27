CREATE TABLE form_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    placeholder VARCHAR(255),
    repeatable BOOLEAN DEFAULT FALSE,
    options_source_table VARCHAR(255) DEFAULT NULL,
    options_query TEXT DEFAULT NULL,
    parent_field_id INT DEFAULT NULL,
    dependent_field VARCHAR(100),
     dependent_table VARCHAR(100),
    required BOOLEAN DEFAULT FALSE,
    disabled BOOLEAN DEFAULT FALSE,
    options TEXT,
    sort_order INT DEFAULT 0,
    field_value VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);