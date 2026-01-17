CREATE DATABASE IF NOT EXISTS govconnect;
CREATE USER IF NOT EXISTS 'govconnect'@'localhost' IDENTIFIED BY 'govconnect123';
GRANT ALL PRIVILEGES ON govconnect.* TO 'govconnect'@'localhost';
FLUSH PRIVILEGES;
