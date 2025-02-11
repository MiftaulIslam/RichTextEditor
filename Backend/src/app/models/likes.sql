-- likes Table
CREATE TABLE `likes` (
  `id` CHAR(36) NOT NULL,
  `article_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `article_id` (`article_id`),
  INDEX `user_id` (`user_id`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);