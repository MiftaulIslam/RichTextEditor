
-- comment_likes Table
CREATE TABLE `comment_likes` (
  `id` CHAR(36) NOT NULL,
  `comment_id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_comment_id` (`comment_id`),
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);