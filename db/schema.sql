CREATE DATABASE IF NOT EXISTS foto_sharing_app;

USE foto_sharing_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  image_url VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE users
ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user';

INSERT INTO users (username, password, role)
VALUES ('admin', '$2a$12$SVnIeT5iVKGvOq0OibjgD.SPjv3JXKoYFwX8zIZc.QCQ0P.D8J4DS', 'admin') ;