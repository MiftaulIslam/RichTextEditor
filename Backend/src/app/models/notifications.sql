CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL,
  `recipient_id` CHAR(36) NOT NULL,
  `sender_id` CHAR(36) NOT NULL,
  `type` ENUM('follow', 'comment', 'like', 'article') NOT NULL,
  `title` VARCHAR(255),
  `content` TEXT,
  `url_to` VARCHAR(255),
  `is_read` BOOLEAN DEFAULT FALSE,
  `highlight` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`recipient_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sender_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 