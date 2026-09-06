CREATE TABLE `role_permission` (
    `role_id` VARCHAR(24) NOT NULL,
    `permission_id` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    KEY `idx_role_permission_permission_id` (`permission_id`),
    CONSTRAINT `fk_role_permission_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
    CONSTRAINT `fk_role_permission_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
