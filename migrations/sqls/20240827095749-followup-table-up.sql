CREATE TABLE follow_ups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    follow_up_date DATE NOT NULL,
    follow_up_type ENUM('Call', 'Visit', 'Email', 'Message', 'Other') NOT NULL,
    follow_up_notes TEXT DEFAULT NULL,
    next_follow_up_date DATE DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);