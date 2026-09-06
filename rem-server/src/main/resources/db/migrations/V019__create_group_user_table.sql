CREATE TABLE `group_user` (
    `group_id` VARCHAR(24) NOT NULL,
    `user_id` VARCHAR(24) NOT NULL,
    CONSTRAINT `uk_group_user_group_user` UNIQUE (`group_id`, `user_id`),
    KEY `idx_group_user_user_id` (`user_id`),
    CONSTRAINT `fk_group_user_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
    CONSTRAINT `fk_group_user_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
