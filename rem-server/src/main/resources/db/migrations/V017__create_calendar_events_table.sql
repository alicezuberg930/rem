CREATE TABLE `calendar_events` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(500) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `start_time` TIME(6) NULL,
    `end_time` TIME(6) NULL,
    `type` ENUM('HOLIDAY','MEETING','LEAVE','ANNOUNCEMENT') NOT NULL,
    `created_by` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_calendar_events_business_id` (`business_id`),
    KEY `idx_calendar_events_created_by` (`created_by`),
    CONSTRAINT `fk_calendar_events_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
    CONSTRAINT `fk_calendar_events_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
