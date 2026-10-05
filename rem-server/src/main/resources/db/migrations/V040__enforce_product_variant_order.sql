ALTER TABLE `product_variants`
    ADD CONSTRAINT `uk_product_variants_product_order`
        UNIQUE (`product_id`, `variant_order`);
