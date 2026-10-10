-- Schema reconstructed from the SQL queries used by backend/.
-- It is intended for local development, not as a replacement for a production backup.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `user` (
  username VARCHAR(60) NOT NULL,
  pass CHAR(40) NOT NULL,
  lastname VARCHAR(100) NOT NULL DEFAULT '',
  firstname VARCHAR(100) NOT NULL DEFAULT '',
  phone VARCHAR(100) NOT NULL DEFAULT '',
  email VARCHAR(150) NOT NULL DEFAULT '',
  role VARCHAR(50) NOT NULL DEFAULT 'Operador',
  type VARCHAR(50) NOT NULL DEFAULT '',
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS brand (
  name VARCHAR(150) NOT NULL,
  PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS category (
  name VARCHAR(150) NOT NULL,
  PRIMARY KEY (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS provider (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  fantasy_name VARCHAR(150) NOT NULL,
  document VARCHAR(50) NOT NULL DEFAULT '',
  name VARCHAR(200) NOT NULL DEFAULT '',
  phone VARCHAR(100) NOT NULL DEFAULT '',
  email VARCHAR(150) NOT NULL DEFAULT '',
  tax_condition VARCHAR(100) NOT NULL DEFAULT '',
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_provider_fantasy_name (fantasy_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS customer (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user VARCHAR(60) NOT NULL DEFAULT '',
  fantasy_name VARCHAR(150) NOT NULL,
  document VARCHAR(50) NOT NULL DEFAULT '',
  name VARCHAR(200) NOT NULL DEFAULT '',
  phone VARCHAR(100) NOT NULL DEFAULT '',
  email VARCHAR(150) NOT NULL DEFAULT '',
  tax_condition VARCHAR(100) NOT NULL DEFAULT '',
  address VARCHAR(200) NOT NULL DEFAULT '',
  city VARCHAR(100) NOT NULL DEFAULT '',
  schedule VARCHAR(200) NOT NULL DEFAULT '',
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_fantasy_name (fantasy_name),
  KEY idx_customer_user (user)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS article (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider INT UNSIGNED NOT NULL,
  brand VARCHAR(150) NOT NULL DEFAULT '',
  category VARCHAR(150) NOT NULL DEFAULT '',
  code VARCHAR(100) NOT NULL DEFAULT '',
  name VARCHAR(200) NOT NULL DEFAULT '',
  size VARCHAR(100) NOT NULL DEFAULT '',
  variety VARCHAR(100) NOT NULL DEFAULT '',
  stock_code VARCHAR(100) NOT NULL DEFAULT '',
  cost DECIMAL(14,2) NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_article_provider (provider),
  KEY idx_article_brand_category (brand, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS price (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  article INT UNSIGNED NOT NULL,
  units DECIMAL(14,3) NOT NULL DEFAULT 1,
  measure VARCHAR(100) NOT NULL,
  price_list DECIMAL(14,2) DEFAULT NULL,
  price_offer DECIMAL(14,2) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_price_article_measure (article, measure),
  KEY idx_price_article (article)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stock (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user VARCHAR(60) NOT NULL,
  article INT UNSIGNED NOT NULL,
  units DECIMAL(14,3) NOT NULL,
  description TEXT NOT NULL,
  datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stock_article (article),
  KEY idx_stock_datetime (datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS buy (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider INT UNSIGNED NOT NULL,
  ticket VARCHAR(100) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  total DECIMAL(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'Inicial',
  datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_buy_provider (provider),
  KEY idx_buy_status_datetime (status, datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS buy_detail (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  buy INT UNSIGNED NOT NULL,
  article INT UNSIGNED DEFAULT NULL,
  concept VARCHAR(255) DEFAULT NULL,
  cost DECIMAL(14,2) DEFAULT NULL,
  quantity DECIMAL(14,3) DEFAULT NULL,
  units DECIMAL(14,3) DEFAULT NULL,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_buy_detail_buy (buy),
  KEY idx_buy_detail_article (article)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS provider_payment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  provider INT UNSIGNED NOT NULL,
  ticket VARCHAR(100) NOT NULL DEFAULT '',
  method VARCHAR(100) NOT NULL DEFAULT '',
  import DECIMAL(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'Aprobado',
  datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_provider_payment_provider (provider),
  KEY idx_provider_payment_status_datetime (status, datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sale (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user VARCHAR(60) NOT NULL,
  customer INT UNSIGNED NOT NULL,
  ticket VARCHAR(100) NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  total DECIMAL(14,2) NOT NULL DEFAULT 0,
  document VARCHAR(50) DEFAULT NULL,
  billing TINYINT(1) NOT NULL DEFAULT 0,
  billing_date DATETIME DEFAULT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Inicial',
  datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sale_customer (customer),
  KEY idx_sale_user (user),
  KEY idx_sale_status_datetime (status, datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sale_detail (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sale INT UNSIGNED NOT NULL,
  article INT UNSIGNED DEFAULT NULL,
  concept VARCHAR(255) DEFAULT NULL,
  measure VARCHAR(100) DEFAULT NULL,
  price DECIMAL(14,2) DEFAULT NULL,
  quantity DECIMAL(14,3) DEFAULT NULL,
  units DECIMAL(14,3) DEFAULT NULL,
  stock DECIMAL(14,3) NOT NULL DEFAULT 0,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  review TINYINT(1) NOT NULL DEFAULT 0,
  deleted TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_sale_detail_sale (sale),
  KEY idx_sale_detail_article (article)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS customer_payment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user VARCHAR(60) NOT NULL,
  customer INT UNSIGNED NOT NULL,
  ticket VARCHAR(100) NOT NULL DEFAULT '',
  method VARCHAR(100) NOT NULL DEFAULT '',
  import DECIMAL(14,2) NOT NULL DEFAULT 0,
  account_name VARCHAR(150) NOT NULL DEFAULT '',
  account_bank VARCHAR(150) NOT NULL DEFAULT '',
  number VARCHAR(100) NOT NULL DEFAULT '',
  cashing_date DATE DEFAULT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Aprobado',
  datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_customer_payment_customer (customer),
  KEY idx_customer_payment_user (user),
  KEY idx_customer_payment_status_datetime (status, datetime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS license (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  month DATE NOT NULL,
  value DECIMAL(14,2) NOT NULL DEFAULT 0,
  coefficient DECIMAL(14,4) DEFAULT NULL,
  coefficient_date DATETIME DEFAULT NULL,
  coefficient_validate DATETIME DEFAULT NULL,
  total DECIMAL(14,2) NOT NULL DEFAULT 0,
  datetime DATE DEFAULT NULL,
  current TINYINT(1) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (id),
  UNIQUE KEY uq_license_month (month),
  KEY idx_license_current (current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS license_item (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  license INT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  value DECIMAL(14,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_license_item_license (license)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS license_payment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  license INT UNSIGNED NOT NULL,
  link VARCHAR(500) DEFAULT NULL,
  total DECIMAL(14,2) NOT NULL DEFAULT 0,
  payment_date DATETIME DEFAULT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
  datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_license_payment_license (license),
  KEY idx_license_payment_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Development-only account for the curl smoke test below: admin / admin123.
INSERT INTO `user` (username, pass, lastname, firstname, role, type, active)
VALUES ('admin', SHA1('admin123'), 'Administrador', 'Local', 'Administrador', 'Administrador', 1)
ON DUPLICATE KEY UPDATE username = username;

INSERT INTO license (month, value, current, status)
VALUES (DATE_FORMAT(CURDATE(), '%Y-%m-01'), 0, 1, 'Aprobado')
ON DUPLICATE KEY UPDATE current = 1, status = 'Aprobado';
