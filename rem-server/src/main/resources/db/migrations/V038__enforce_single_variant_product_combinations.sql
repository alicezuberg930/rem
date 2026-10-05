ALTER TABLE `product_variant_combinations`
    DROP INDEX `uk_product_variant_combinations_product_values`,
    ADD CONSTRAINT `uk_product_variant_combinations_product_option`
        UNIQUE (`product_id`, `variant_value_1_id`);
