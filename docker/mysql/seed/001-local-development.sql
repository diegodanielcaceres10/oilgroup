-- Local development data only.
-- Safe to run multiple times: all records use the DEV-* namespace.
-- Loaded automatically when the local database is first created (empty volume).
-- To load it into an existing database, run:
-- docker compose exec -T db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" oilgroup < /seed/001-local-development.sql'

SET NAMES utf8mb4;
START TRANSACTION;

INSERT INTO `user` (username, pass, lastname, firstname, phone, email, role, type, active)
VALUES
  ('devseller', SHA1('test123'), 'Vendedor', 'Demo', '11-5555-0101', 'devseller@local.test', 'Vendedor', 'Operador', 1),
  ('devmanager', SHA1('test123'), 'Gerente', 'Demo', '11-5555-0102', 'devmanager@local.test', 'Administrador', 'Administrador', 1)
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO brand (name) VALUES ('DEV-ACME'), ('DEV-ENERGY')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO category (name) VALUES ('DEV-Lubricantes'), ('DEV-Accesorios')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO provider (fantasy_name, document, name, phone, email, tax_condition, active)
VALUES ('DEV-PROVEEDOR ACME', '30-12345678-9', 'Proveedor ACME S.A.', '11-4444-0100', 'ventas@acme.local.test', 'Responsable Inscripto', 1)
ON DUPLICATE KEY UPDATE fantasy_name = VALUES(fantasy_name);
SET @provider_id := (SELECT id FROM provider WHERE fantasy_name = 'DEV-PROVEEDOR ACME');

INSERT INTO customer (user, fantasy_name, document, name, phone, email, tax_condition, address, city, schedule, active)
VALUES
  ('devseller', 'DEV-CLIENTE TALLER NORTE', '20-12345678-1', 'Taller Norte SRL', '11-5555-1001', 'taller.norte@local.test', 'Responsable Inscripto', 'Av. Siempre Viva 123', 'Buenos Aires', 'Lun a Vie 09:00 a 18:00', 1),
  ('devseller', 'DEV-CLIENTE SUR', '27-87654321-2', 'Comercial Sur', '11-5555-1002', 'comercial.sur@local.test', 'Monotributo', 'Calle 456', 'Buenos Aires', 'Lun a Sab 08:00 a 17:00', 1)
ON DUPLICATE KEY UPDATE fantasy_name = VALUES(fantasy_name);
SET @customer_north := (SELECT id FROM customer WHERE fantasy_name = 'DEV-CLIENTE TALLER NORTE');
SET @customer_south := (SELECT id FROM customer WHERE fantasy_name = 'DEV-CLIENTE SUR');

INSERT INTO article (provider, brand, category, code, name, size, variety, stock_code, cost, description, active)
SELECT @provider_id, 'DEV-ACME', 'DEV-Lubricantes', 'DEV-001', 'Aceite Motor Sintético', '1L', '5W-30', 'DEV-STK-001', 12000.00, 'Artículo de prueba para entorno local', 1
WHERE NOT EXISTS (SELECT 1 FROM article WHERE code = 'DEV-001');
INSERT INTO article (provider, brand, category, code, name, size, variety, stock_code, cost, description, active)
SELECT @provider_id, 'DEV-ACME', 'DEV-Lubricantes', 'DEV-002', 'Aceite Motor Mineral', '4L', '20W-50', 'DEV-STK-002', 23000.00, 'Artículo de prueba para entorno local', 1
WHERE NOT EXISTS (SELECT 1 FROM article WHERE code = 'DEV-002');
INSERT INTO article (provider, brand, category, code, name, size, variety, stock_code, cost, description, active)
SELECT @provider_id, 'DEV-ENERGY', 'DEV-Accesorios', 'DEV-003', 'Filtro de Aceite', 'Unidad', 'Estándar', 'DEV-STK-003', 4500.00, 'Artículo de prueba para entorno local', 1
WHERE NOT EXISTS (SELECT 1 FROM article WHERE code = 'DEV-003');

SET @article_oil_1 := (SELECT id FROM article WHERE code = 'DEV-001' LIMIT 1);
SET @article_oil_2 := (SELECT id FROM article WHERE code = 'DEV-002' LIMIT 1);
SET @article_filter := (SELECT id FROM article WHERE code = 'DEV-003' LIMIT 1);

INSERT INTO price (article, units, measure, price_list, price_offer)
VALUES
  (@article_oil_1, 1, 'Unidad', 18000.00, 16500.00),
  (@article_oil_2, 1, 'Unidad', 32000.00, 29500.00),
  (@article_filter, 1, 'Unidad', 7500.00, 6900.00)
ON DUPLICATE KEY UPDATE price_list = VALUES(price_list), price_offer = VALUES(price_offer);

INSERT INTO stock (user, article, units, description)
SELECT 'devseller', @article_oil_1, 30, 'Carga inicial DEV-001'
WHERE NOT EXISTS (SELECT 1 FROM stock WHERE article = @article_oil_1 AND description = 'Carga inicial DEV-001');
INSERT INTO stock (user, article, units, description)
SELECT 'devseller', @article_oil_2, 15, 'Carga inicial DEV-002'
WHERE NOT EXISTS (SELECT 1 FROM stock WHERE article = @article_oil_2 AND description = 'Carga inicial DEV-002');
INSERT INTO stock (user, article, units, description)
SELECT 'devseller', @article_filter, 50, 'Carga inicial DEV-003'
WHERE NOT EXISTS (SELECT 1 FROM stock WHERE article = @article_filter AND description = 'Carga inicial DEV-003');

INSERT INTO buy (provider, ticket, description, total, status, datetime)
SELECT @provider_id, 'DEV-COMPRA-001', 'Compra de prueba', 427500.00, 'Aprobada', NOW() - INTERVAL 10 DAY
WHERE NOT EXISTS (SELECT 1 FROM buy WHERE ticket = 'DEV-COMPRA-001');
SET @buy_id := (SELECT id FROM buy WHERE ticket = 'DEV-COMPRA-001' LIMIT 1);
INSERT INTO buy_detail (buy, article, cost, quantity, units, subtotal)
SELECT @buy_id, @article_oil_1, 12000.00, 20, 20, 240000.00
WHERE NOT EXISTS (SELECT 1 FROM buy_detail WHERE buy = @buy_id AND article = @article_oil_1);
INSERT INTO buy_detail (buy, article, cost, quantity, units, subtotal)
SELECT @buy_id, @article_oil_2, 23000.00, 5, 5, 115000.00
WHERE NOT EXISTS (SELECT 1 FROM buy_detail WHERE buy = @buy_id AND article = @article_oil_2);
INSERT INTO buy_detail (buy, article, cost, quantity, units, subtotal)
SELECT @buy_id, @article_filter, 4500.00, 15, 15, 67500.00
WHERE NOT EXISTS (SELECT 1 FROM buy_detail WHERE buy = @buy_id AND article = @article_filter);

INSERT INTO provider_payment (provider, ticket, method, import, status, datetime)
SELECT @provider_id, 'DEV-PAGO-PROV-001', 'Transferencia', 100000.00, 'Aprobado', NOW() - INTERVAL 8 DAY
WHERE NOT EXISTS (SELECT 1 FROM provider_payment WHERE ticket = 'DEV-PAGO-PROV-001');

INSERT INTO sale (user, customer, ticket, description, total, document, billing, status, datetime)
SELECT 'devseller', @customer_north, 'DEV-VENTA-001', 'Venta aprobada de prueba', 39900.00, 'Factura B', 0, 'Aprobada', NOW() - INTERVAL 5 DAY
WHERE NOT EXISTS (SELECT 1 FROM sale WHERE ticket = 'DEV-VENTA-001');
SET @sale_approved := (SELECT id FROM sale WHERE ticket = 'DEV-VENTA-001' LIMIT 1);
INSERT INTO sale_detail (sale, article, measure, price, quantity, units, stock, subtotal, review, deleted)
SELECT @sale_approved, @article_oil_1, 'Unidad', 16500.00, 2, 2, 2, 33000.00, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM sale_detail WHERE sale = @sale_approved AND article = @article_oil_1);
INSERT INTO sale_detail (sale, article, measure, price, quantity, units, stock, subtotal, review, deleted)
SELECT @sale_approved, @article_filter, 'Unidad', 6900.00, 1, 1, 1, 6900.00, 1, 0
WHERE NOT EXISTS (SELECT 1 FROM sale_detail WHERE sale = @sale_approved AND article = @article_filter);

INSERT INTO sale (user, customer, ticket, description, total, document, billing, status, datetime)
SELECT 'devseller', @customer_south, 'DEV-VENTA-002', 'Venta pendiente de prueba', 29500.00, 'Factura B', 0, 'Pendiente', NOW() - INTERVAL 1 DAY
WHERE NOT EXISTS (SELECT 1 FROM sale WHERE ticket = 'DEV-VENTA-002');
SET @sale_pending := (SELECT id FROM sale WHERE ticket = 'DEV-VENTA-002' LIMIT 1);
INSERT INTO sale_detail (sale, article, measure, price, quantity, units, stock, subtotal, review, deleted)
SELECT @sale_pending, @article_oil_2, 'Unidad', 29500.00, 1, 1, 1, 29500.00, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM sale_detail WHERE sale = @sale_pending AND article = @article_oil_2);

INSERT INTO customer_payment (user, customer, ticket, method, import, account_name, account_bank, number, status, datetime)
SELECT 'devseller', @customer_north, 'DEV-PAGO-CLI-001', 'Transferencia', 20000.00, 'Taller Norte SRL', 'Banco Local', 'DEV-0001', 'Aprobado', NOW() - INTERVAL 3 DAY
WHERE NOT EXISTS (SELECT 1 FROM customer_payment WHERE ticket = 'DEV-PAGO-CLI-001');

COMMIT;
