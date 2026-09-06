CREATE TABLE `templates` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `header` LONGTEXT NOT NULL,
    `body` LONGTEXT NOT NULL,
    `footer` LONGTEXT NULL,
    `contact_phone` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_templates_business_id` (`business_id`),
    CONSTRAINT `fk_templates_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
