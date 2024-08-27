-- New table for storing form sections
CREATE TABLE form_sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id INT NOT NULL,
  section_title VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);