CREATE TABLE `variants` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_variants_business_name` UNIQUE (`business_id`, `name`),
    KEY `idx_variants_business_id` (`business_id`),
    CONSTRAINT `fk_variants_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `variant_values` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `variant_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_variant_values_variant_name` UNIQUE (`variant_id`, `name`),
    KEY `idx_variant_values_variant_id` (`variant_id`),
    CONSTRAINT `fk_variant_values_variant` FOREIGN KEY (`variant_id`) REFERENCES `variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `business_id` VARCHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `sku` VARCHAR(255) NOT NULL,
    `unit` VARCHAR(255) NOT NULL,
    `bar_code_type` ENUM('AZTEC','CODABAR','CODE_39','CODE_93','CODE_128','DATA_MATRIX','EAN_8','EAN_13','ITF','PDF_417','UPC_A','UPC_E') NOT NULL,
    `expired_date` DATE NULL,
    `description` TEXT NULL,
    `preview_image_url` VARCHAR(255) NULL,
    `price` BIGINT NULL,
    `variant_mode` ENUM('VARIABLE','SIMPLE') NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_products_business_id_name` (`business_id`, `name`),
    CONSTRAINT `fk_products_business` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_variants` (
    `product_id` VARCHAR(24) NOT NULL,
    `variant_id` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`product_id`, `variant_id`),
    KEY `idx_product_variants_variant_id` (`variant_id`),
    CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
    CONSTRAINT `fk_product_variants_variant` FOREIGN KEY (`variant_id`) REFERENCES `variants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_variant_combinations` (
    `id` VARCHAR(24) NOT NULL,
    `created_at` DATETIME(6) NULL,
    `updated_at` DATETIME(6) NULL,
    `product_id` VARCHAR(24) NOT NULL,
    `sku` VARCHAR(255) NOT NULL,
    `price` BIGINT NOT NULL,
    `variant_value_1_id` VARCHAR(24) NOT NULL,
    `variant_value_2_id` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_product_variant_combinations_product_values` UNIQUE (`product_id`, `variant_value_1_id`, `variant_value_2_id`),
    KEY `idx_product_variant_combinations_product_id` (`product_id`),
    KEY `idx_product_variant_combinations_value_1_id` (`variant_value_1_id`),
    KEY `idx_product_variant_combinations_value_2_id` (`variant_value_2_id`),
    CONSTRAINT `fk_product_variant_combinations_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
    CONSTRAINT `fk_product_variant_combinations_value_1` FOREIGN KEY (`variant_value_1_id`) REFERENCES `variant_values` (`id`),
    CONSTRAINT `fk_product_variant_combinations_value_2` FOREIGN KEY (`variant_value_2_id`) REFERENCES `variant_values` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
