CREATE TABLE `tasks` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NULL,
    `assignee_id` VARCHAR(24) NOT NULL,
    `sub_task_id` VARCHAR(24) NULL,
    `title` VARCHAR(255) NULL,
    `priority` ENUM('LOWEST','LOW','MEDIUM','HIGH','HIGHEST') NULL,
    `status` ENUM('IN_PROGRESS','TESTING','COMPLETED','PROCESSING','WAITING_FOR_APPROVAL','ON_HOLD') NULL,
    `start_date` DATETIME(6) NULL,
    `due_date` DATETIME(6) NULL,
    `description` LONGTEXT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_tasks_business_created_at` (`business_id`, `created_at`),
    KEY `idx_tasks_assignee_id` (`assignee_id`),
    KEY `idx_tasks_sub_task_id` (`sub_task_id`),
    CONSTRAINT `fk_tasks_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`),
    CONSTRAINT `fk_tasks_assignee` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_tasks_sub_task` FOREIGN KEY (`sub_task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task_labels` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `title` VARCHAR(255) NOT NULL,
    `task_id` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_task_labels_task_title` UNIQUE (`task_id`, `title`),
    CONSTRAINT `fk_task_labels_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task_attachments` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `title` VARCHAR(255) NULL,
    `url` VARCHAR(255) NULL,
    `task_id` VARCHAR(24) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_task_attachments_task_id` (`task_id`),
    CONSTRAINT `fk_task_attachments_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task_comments` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `content` LONGTEXT NULL,
    `task_id` VARCHAR(24) NULL,
    `user_id` VARCHAR(24) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_task_comments_task_created_at` (`task_id`, `created_at`),
    KEY `idx_task_comments_user_id` (`user_id`),
    CONSTRAINT `fk_task_comments_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
    CONSTRAINT `fk_task_comments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task_comment_attachments` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `title` VARCHAR(255) NULL,
    `task_comment_id` VARCHAR(24) NULL,
    PRIMARY KEY (`id`),
    KEY `idx_task_comment_attachments_comment_id` (`task_comment_id`),
    CONSTRAINT `fk_task_comment_attachments_comment` FOREIGN KEY (`task_comment_id`) REFERENCES `task_comments` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task_histories` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `title` VARCHAR(255) NULL,
    `task_id` VARCHAR(24) NULL,
    `user_id` VARCHAR(24) NULL,
    `from_description` VARCHAR(255) NULL,
    `to_description` VARCHAR(255) NULL,
    `type` ENUM('STATUS','DATE','LABEL','ATTACHMENT','ASSIGNEE','DESCRIPTION') NULL,
    `action` ENUM('UPDATE','CREATE','DELETE') NULL,
    PRIMARY KEY (`id`),
    KEY `idx_task_histories_task_created_at` (`task_id`, `created_at`),
    KEY `idx_task_histories_user_id` (`user_id`),
    CONSTRAINT `fk_task_histories_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
    CONSTRAINT `fk_task_histories_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
