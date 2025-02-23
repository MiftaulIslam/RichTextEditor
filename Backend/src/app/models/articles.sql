
-- articles Table
CREATE TABLE `articles` (
  `id` CHAR(36) NOT NULL,
  `author_id` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(355) NOT NULL UNIQUE,
  `content` TEXT NOT NULL,
  `thumbnail` TEXT NULL,
  `views` INT DEFAULT 0,
  `is_published` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `publishedAt` TIMESTAMP(0) NULL,
  `short_preview` VARCHAR(250) NULL,
  `estimate_reading_time` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `author_id` (`author_id`),
  FOREIGN KEY (`author_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);
