CREATE TABLE `users` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `avatar` VARCHAR(255) NULL,
    `provider` ENUM('LOCAL','FACEBOOK','GOOGLE') NOT NULL,
    `birthday` DATE NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NULL,
    `is_verified` BIT(1) NOT NULL,
    `verify_token` VARCHAR(255) NULL,
    `verify_token_expires` DATETIME(6) NULL,
    `reset_password_token` VARCHAR(255) NULL,
    `reset_password_expires` DATETIME(6) NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_users_phone` UNIQUE (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
