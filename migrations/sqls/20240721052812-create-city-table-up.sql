CREATE TABLE city (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `state_id` INT,
    `is_active` boolean DEFAULT 1,
    FOREIGN KEY (`state_id`) REFERENCES state(`id`)
);
