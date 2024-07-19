CREATE TABLE IF NOT EXISTS `fruits` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL UNIQUE,
`name_hindi` varchar(255),
`description` TEXT,
`is_active` boolean DEFAULT 1,
`created_by` int(10) NOT NULL,
`updated_by` int(10),
`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
