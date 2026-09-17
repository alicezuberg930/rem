CREATE TABLE `media_permissions` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `media_id` VARCHAR(24) NOT NULL,
    `user_id` VARCHAR(24) NOT NULL,
    `permission` ENUM('VIEWER','EDITOR') NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_media_permissions_media_user` UNIQUE (`media_id`, `user_id`),
    KEY `idx_media_permissions_user_id` (`user_id`),
    CONSTRAINT `fk_media_permissions_media` FOREIGN KEY (`media_id`) REFERENCES `medias` (`id`),
    CONSTRAINT `fk_media_permissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
