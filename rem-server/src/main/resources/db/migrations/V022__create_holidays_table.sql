CREATE TABLE `holidays` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `date` DATE NOT NULL,
    `description` VARCHAR(255) NULL,
    `is_recurring` BIT(1) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_holidays_business_id` (`business_id`),
    CONSTRAINT `fk_holidays_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
