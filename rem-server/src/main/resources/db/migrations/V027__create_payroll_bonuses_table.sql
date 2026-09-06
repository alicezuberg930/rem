CREATE TABLE `payroll_bonuses` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `payroll_record_id` VARCHAR(24) NOT NULL,
    `type` ENUM('PERFORMANCE','HOLIDAY','PROJECT','OTHER') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `note` VARCHAR(500) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_payroll_bonuses_payroll_record_id` (`payroll_record_id`),
    CONSTRAINT `fk_payroll_bonuses_payroll_item` FOREIGN KEY (`payroll_record_id`) REFERENCES `payroll_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
