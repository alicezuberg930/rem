CREATE TABLE `allowances` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `amount` INT NULL,
    `is_active` BIT(1) NULL,
    `type` ENUM('MEAL','TRANSPORT','HOUSING','PHONE','OTHER') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_allowances_business_id` (`business_id`),
    CONSTRAINT `fk_allowances_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
