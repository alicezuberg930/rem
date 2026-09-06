CREATE TABLE `groups` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `name` VARCHAR(100) NOT NULL,
    `avatar` VARCHAR(255) NOT NULL,
    `business_id` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_groups_business_id` (`business_id`),
    CONSTRAINT `fk_groups_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
