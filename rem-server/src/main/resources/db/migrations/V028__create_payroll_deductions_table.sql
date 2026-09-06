CREATE TABLE `payroll_deductions` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `payroll_record_id` VARCHAR(24) NOT NULL,
    `type` ENUM('TAX','INSURANCE','LATE','ABSENT','UNPAID_LEAVE','OTHER') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `note` VARCHAR(500) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_payroll_deductions_payroll_record_id` (`payroll_record_id`),
    CONSTRAINT `fk_payroll_deductions_payroll_item` FOREIGN KEY (`payroll_record_id`) REFERENCES `payroll_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
