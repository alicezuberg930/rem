ALTER TABLE `product_variants`
    ADD COLUMN `variant_order` INT NULL AFTER `variant_id`;

UPDATE `product_variants` AS `target`
SET `variant_order` = (
    SELECT COUNT(*)
    FROM (
        SELECT `product_id`, `variant_id`
        FROM `product_variants`
    ) AS `source`
    WHERE `source`.`product_id` = `target`.`product_id`
      AND `source`.`variant_id` < `target`.`variant_id`
);

ALTER TABLE `product_variants`
    MODIFY COLUMN `variant_order` INT NOT NULL;

ALTER TABLE `product_variant_combinations`
    DROP INDEX `uk_product_variant_combinations_product_option`,
    ADD COLUMN `variant_value_2_key` VARCHAR(24)
        GENERATED ALWAYS AS (COALESCE(`variant_value_2_id`, '')) STORED,
    ADD CONSTRAINT `uk_product_variant_combinations_product_values`
        UNIQUE (`product_id`, `variant_value_1_id`, `variant_value_2_key`);
