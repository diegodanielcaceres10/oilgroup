# oilgroup

## Entorno local con Docker

Ejecutá `docker compose up --build` desde la raíz del repositorio.

- Frontend: `http://localhost:4200`
- API: `http://localhost:3000/local/oilgroup/api/`
- MySQL: `localhost:3306` (base `oilgroup`, usuario `oilgroup`)

La base se inicializa automáticamente con el esquema reconstruido desde las consultas del backend y un usuario local `admin` / `admin123`. Esto es exclusivamente para desarrollo: cambiá las credenciales en `.env` y reemplazá el esquema con un respaldo real si está disponible. Para credenciales locales distintas, definí `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` y `SECRETJWT` en un archivo `.env` en la raíz, que no se versiona.

### Datos de prueba

El seed idempotente está en `docker/mysql/seed/001-local-development.sql`. Con los contenedores levantados, cargalo manualmente con:

```bash
docker compose exec -T db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" oilgroup < /seed/001-local-development.sql'
```

Incluye el usuario `devseller` / `test123`, dos clientes, un proveedor, tres artículos, inventario, compras, ventas y pagos con prefijo `DEV-`.
