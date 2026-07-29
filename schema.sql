CREATE TABLE `members` (
  `member_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `membership_type` enum('Student','Admin') NOT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `rosters` (
  `roster_id` int NOT NULL AUTO_INCREMENT,
  `member_id` int NOT NULL,
  `club_id` int NOT NULL,
  `join_date` date NOT NULL,
  PRIMARY KEY (`roster_id`),
  KEY `member_id` (`member_id`),
  KEY `club_id` (`club_id`),
  CONSTRAINT `rosters_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE,
  CONSTRAINT `rosters_ibfk_2` FOREIGN KEY (`club_id`) REFERENCES `sportsclubs` (`club_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `sportsclubs` (
  `club_id` int NOT NULL AUTO_INCREMENT,
  `club_name` varchar(100) NOT NULL,
  `coach_name` varchar(100) NOT NULL,
  `max_capacity` int NOT NULL,
  PRIMARY KEY (`club_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;