-- ============================================================
--  The Architectural Sanctuary — MySQL Schema
--  Run this once to set up the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS sanctuary_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sanctuary_db;

CREATE TABLE IF NOT EXISTS users (
  id          INT          AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,          -- bcrypt hash, never plain text
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: verify the table was created
-- DESCRIBE users;
-- SELECT * FROM users;
