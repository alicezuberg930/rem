CREATE TABLE `customers` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `contact_id` VARCHAR(24) NOT NULL,
    `customer_group_id` VARCHAR(24) NULL,
    `customer_since` DATE NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_customers_contact_id` UNIQUE (`contact_id`),
    KEY `idx_customers_customer_group_id` (`customer_group_id`),
    CONSTRAINT `fk_customers_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`),
    CONSTRAINT `fk_customers_customer_group` FOREIGN KEY (`customer_group_id`) REFERENCES `customer_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
