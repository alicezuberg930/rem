CREATE TABLE `branches` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_branches_business_id` (`business_id`),
    CONSTRAINT `fk_branches_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
