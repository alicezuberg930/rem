CREATE TABLE `campaign_contact` (
    `campaign_id` VARCHAR(24) NOT NULL,
    `contact_id` VARCHAR(24) NOT NULL,
    PRIMARY KEY (`campaign_id`, `contact_id`),
    KEY `idx_campaign_contact_contact_id` (`contact_id`),
    CONSTRAINT `fk_campaign_contact_campaign` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`),
    CONSTRAINT `fk_campaign_contact_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
