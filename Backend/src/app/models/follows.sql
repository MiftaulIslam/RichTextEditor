
-- follows Table
CREATE TABLE `follows` (
  `follower_id` CHAR(36) NOT NULL,
  `following_id` CHAR(36) NOT NULL,
  `created_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `following_id`),
  INDEX `following_id` (`following_id`),
  FOREIGN KEY (`follower_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (`following_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);