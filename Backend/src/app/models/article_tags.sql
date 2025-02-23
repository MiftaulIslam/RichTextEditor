-- article_tags Table
CREATE TABLE `article_tags` (
  `article_id` CHAR(36) NOT NULL,
  `tag_id` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`article_id`, `tag_id`),
  INDEX `tag_id` (`tag_id`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);