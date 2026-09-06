CREATE TABLE `customer_groups` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `name` VARCHAR(100) NOT NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `percentage` DOUBLE NULL,
    PRIMARY KEY (`id`),
    KEY `idx_customer_groups_business_id` (`business_id`),
    CONSTRAINT `fk_customer_groups_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
