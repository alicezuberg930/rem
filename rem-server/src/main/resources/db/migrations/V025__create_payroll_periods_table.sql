CREATE TABLE `payroll_periods` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `status` ENUM('DRAFT','PROCESSING','APPROVED','PAID','CANCELLED') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_payroll_periods_business_id` (`business_id`),
    CONSTRAINT `fk_payroll_periods_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
