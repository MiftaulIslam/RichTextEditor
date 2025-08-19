-- comments Table
CREATE TABLE `comments` (
  `id` CHAR(36) NOT NULL,
  `article_id` CHAR(36) NOT NULL,
  `author_id` CHAR(36) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  `parent_id` CHAR(36) NULL,
  PRIMARY KEY (`id`),
  INDEX `article_id` (`article_id`),
  INDEX `author_id` (`author_id`),
  INDEX `parent_id` (`parent_id`),
  FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`author_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);
