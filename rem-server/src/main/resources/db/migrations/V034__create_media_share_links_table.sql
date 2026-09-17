CREATE TABLE `media_share_links` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `media_id` VARCHAR(24) NOT NULL,
    `created_by_user_id` VARCHAR(24) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `permission` ENUM('VIEWER','EDITOR') NOT NULL,
    `expires_at` DATETIME(6) NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_media_share_links_token` UNIQUE (`token`),
    KEY `idx_media_share_links_media_id` (`media_id`),
    KEY `idx_media_share_links_created_by_user_id` (`created_by_user_id`),
    CONSTRAINT `fk_media_share_links_media` FOREIGN KEY (`media_id`) REFERENCES `medias` (`id`),
    CONSTRAINT `fk_media_share_links_created_by_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
