CREATE TABLE `contact_tags` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `name` VARCHAR(255) NOT NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `color` ENUM('RED','GREEN','BLUE','YELLOW','ORANGE','PURPLE','PINK','BROWN','GRAY') NOT NULL,
    `is_active` BIT(1) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_contact_tags_business_id` (`business_id`),
    CONSTRAINT `fk_contact_tags_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
