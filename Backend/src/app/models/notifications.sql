-- notifications Table
CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL,
  `recipient_id` CHAR(36) NOT NULL,
  `sender_id` CHAR(36) NOT NULL,
  `type` ENUM('follow', 'comment', 'like', 'article', 'other') NOT NULL,
  `title` VARCHAR(255) NULL,
  `content` TEXT NULL,
  `url_to` VARCHAR(255) NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `highlight` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `recipient_id` (`recipient_id`),
  INDEX `sender_id` (`sender_id`),
  FOREIGN KEY (`recipient_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`sender_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);