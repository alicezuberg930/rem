CREATE TABLE `notifications` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `time` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `is_read` BIT(1) NOT NULL DEFAULT b'0',
    `to_user_id` VARCHAR(24) NOT NULL,
    `unique_key` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    KEY `notifications_business_id_idx` (`business_id`),
    KEY `notifications_to_user_id_idx` (`to_user_id`),
    KEY `notifications_unique_key_idx` (`unique_key`),
    CONSTRAINT `fk_notifications_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_notifications_to_user` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `push_notifications` (
    `id` VARCHAR(24) NOT NULL,
    `user_id` VARCHAR(24) NOT NULL,
    `endpoint` TEXT NOT NULL,
    `p256dh` VARCHAR(255) NOT NULL,
    `auth` VARCHAR(255) NOT NULL,
    `ip` VARCHAR(45) NULL,
    `created_date` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `browser` VARCHAR(255) NULL,
    `device_type` VARCHAR(255) NULL,
    `device_vendor` VARCHAR(255) NULL,
    `device_model` VARCHAR(255) NULL,
    `cpu` VARCHAR(255) NULL,
    `os` VARCHAR(255) NULL,
    PRIMARY KEY (`id`),
    KEY `push_notifications_user_id_idx` (`user_id`),
    CONSTRAINT `fk_push_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
