CREATE TABLE `campaigns` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `template_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `send_type` ENUM('IMMEDIATE','SCHEDULED') NOT NULL,
    `schedule_at` DATETIME(6) NULL,
    `status` ENUM('PENDING','PROCESSING','SENT','FAILED') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_campaigns_business_id` (`business_id`),
    KEY `idx_campaigns_template_id` (`template_id`),
    CONSTRAINT `fk_campaigns_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
    CONSTRAINT `fk_campaigns_template` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
