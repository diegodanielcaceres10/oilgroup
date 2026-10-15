# Checklist manual de regresión

## Propósito

Ejecutar esta lista después de cada major de Angular durante la migración a Angular 22. El objetivo es detectar regresiones funcionales, de navegación, de API y de presentación antes de avanzar al siguiente major.

No se debe avanzar si falla un caso crítico de autenticación, ventas, compras, pagos, facturación o exportación.

## Preparación

1. Levantar el entorno local:

   ```bash
   docker compose up -d
   ```

2. Cargar los datos locales de prueba, si todavía no existen:

   ```bash
   docker compose exec -T db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" oilgroup < /seed/001-local-development.sql'
   ```

3. Abrir el frontend en `http://localhost:6004`.
4. Usar la cuenta de prueba `devseller` / `test123`.
5. Abrir las herramientas de desarrollo del navegador y conservar visible la pestaña **Console** y **Network**.
6. Crear una copia del resultado de esta checklist para el major evaluado, por ejemplo: `docs/test-evidence/angular-16.md`.

## Criterios generales

En todos los casos validar además que:

- La pantalla no presenta errores en consola.
- Las llamadas HTTP no devuelven errores `4xx` o `5xx` inesperados.
- No hay pantallas en blanco, rutas rotas ni redirecciones en bucle.
- Los textos con acentos se ven correctamente.
- Los montos, fechas y estados se muestran con formato coherente.
- Un refresh del navegador conserva o recupera el estado esperado.

## Resultado esperado

Marcar cada caso como:

- `PASS`: completó y coincidió con el resultado esperado.
- `FAIL`: no completó, mostró datos incorrectos o produjo errores.
- `BLOCKED`: no pudo realizarse por una dependencia externa; documentar cuál.

Para cada `FAIL`, registrar URL, usuario, pasos, resultado, error de consola/red y captura de pantalla.

## Smoke test de inicio

| ID     | Caso               | Pasos                                            | Resultado esperado                                                           |
| ------ | ------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| SMK-01 | Carga inicial      | Abrir la URL del frontend.                       | La aplicación carga sin pantalla en blanco ni errores de compilación.        |
| SMK-02 | Refresh directo    | Refrescar la página estando en una ruta interna. | La ruta se resuelve correctamente o redirige a login de forma controlada.    |
| SMK-03 | Responsive básico  | Probar ancho desktop y móvil en DevTools.        | Menú, tablas y formularios no quedan inutilizables ni desbordan la pantalla. |
| SMK-04 | Sesión persistente | Iniciar sesión, refrescar y navegar.             | La sesión se conserva según el comportamiento actual.                        |
| SMK-05 | Cierre de sesión   | Cerrar sesión y volver con el botón Atrás.       | No permite acceder a una pantalla protegida sin autenticación.               |

## Autenticación y autorización

| ID      | Caso                   | Pasos                                                                       | Resultado esperado                                    |
| ------- | ---------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| AUTH-01 | Login correcto         | Ingresar `devseller` / `test123`.                                           | Acceso al panel y datos del usuario visibles.         |
| AUTH-02 | Credenciales inválidas | Ingresar una clave incorrecta.                                              | Mensaje controlado; no se guarda una sesión inválida. |
| AUTH-03 | Campos vacíos          | Enviar formulario sin usuario o clave.                                      | Validación visible sin error de consola.              |
| AUTH-04 | Ruta protegida         | Copiar una URL interna, cerrar sesión y abrirla.                            | Redirección o bloqueo controlado.                     |
| AUTH-05 | Token inválido         | Borrar o modificar el token en el almacenamiento del navegador y refrescar. | Se invalida la sesión de forma segura.                |

## Panel y métricas

| ID     | Caso               | Pasos                                                                | Resultado esperado                                       |
| ------ | ------------------ | -------------------------------------------------------------------- | -------------------------------------------------------- |
| MET-01 | Panel principal    | Abrir el dashboard.                                                  | Se cargan métricas, gráficos y contadores.               |
| MET-02 | Datos seed         | Verificar ventas pendientes y artículos destacados.                  | Se reflejan los datos `DEV-*` del seed.                  |
| MET-03 | Filtros de usuario | Si la pantalla permite filtrar por usuario, seleccionar `devseller`. | Las métricas se actualizan sin errores SQL o de UI.      |
| MET-04 | Cambio de período  | Probar filtros/controles temporales disponibles.                     | Fechas, gráficos y totales se actualizan coherentemente. |

## Usuarios

| ID     | Caso               | Pasos                                                       | Resultado esperado                                        |
| ------ | ------------------ | ----------------------------------------------------------- | --------------------------------------------------------- |
| USR-01 | Listado            | Abrir Usuarios.                                             | Lista cargada y ordenada; no faltan columnas principales. |
| USR-02 | Alta               | Crear un usuario con nombre único `test-migracion-<major>`. | Usuario creado y visible en el listado.                   |
| USR-03 | Edición            | Modificar teléfono o email del usuario creado.              | Cambios persistentes después de refrescar.                |
| USR-04 | Cambio de clave    | Cambiar clave para el usuario de prueba.                    | Puede iniciar sesión con la nueva clave.                  |
| USR-05 | Activar/desactivar | Desactivar y volver a activar el usuario de prueba.         | El estado cambia y se refleja en el listado.              |

## Clientes y proveedores

| ID     | Caso                   | Pasos                                            | Resultado esperado                                   |
| ------ | ---------------------- | ------------------------------------------------ | ---------------------------------------------------- |
| CRM-01 | Listado de clientes    | Abrir Clientes y buscar `DEV-CLIENTE`.           | Se muestran los dos clientes del seed.               |
| CRM-02 | Alta de cliente        | Crear un cliente con razón social única.         | Alta exitosa y validación de campos obligatorios.    |
| CRM-03 | Edición de cliente     | Editar teléfono, email o dirección.              | Datos persistentes tras refresh.                     |
| CRM-04 | Estado de cliente      | Alternar activo/inactivo del cliente de prueba.  | Estado actualizado sin afectar otros clientes.       |
| CRM-05 | Detalle e historial    | Abrir detalle de `DEV-CLIENTE TALLER NORTE`.     | Se muestran ventas, pagos, saldo e historial.        |
| CRM-06 | Listado de proveedores | Abrir Proveedores y buscar `DEV-PROVEEDOR ACME`. | Se muestran artículos, compras y pagos relacionados. |
| CRM-07 | Alta/edición proveedor | Crear y editar un proveedor de prueba.           | Validaciones y persistencia correctas.               |

## Artículos, categorías, marcas y stock

| ID     | Caso              | Pasos                                                     | Resultado esperado                                                  |
| ------ | ----------------- | --------------------------------------------------------- | ------------------------------------------------------------------- |
| ART-01 | Listado           | Abrir Artículos y buscar `DEV-001`, `DEV-002`, `DEV-003`. | Se muestran nombre, marca, categoría y stock.                       |
| ART-02 | Detalle           | Abrir `DEV-001`.                                          | Se visualizan proveedor, precios, historial y existencias.          |
| ART-03 | Alta de artículo  | Crear un artículo temporal con código único.              | Se crea con una medida inicial y queda disponible para operaciones. |
| ART-04 | Editar artículo   | Cambiar descripción, costo o proveedor.                   | Cambios persistentes tras refresh.                                  |
| ART-05 | Medidas y precios | Agregar o editar una medida/precio.                       | No se duplican medidas; monto y unidades se guardan.                |
| ART-06 | Ajuste de stock   | Registrar un ajuste positivo y uno negativo razonable.    | El historial y stock resultante se actualizan.                      |
| ART-07 | Marcas/categorías | Crear o editar marca y categoría.                         | Se reflejan en el formulario y filtros de artículos.                |
| ART-08 | Activación        | Desactivar y reactivar un artículo temporal.              | No se ofrece como artículo activo mientras está desactivado.        |

## Compras y pagos a proveedores

| ID     | Caso                | Pasos                                                        | Resultado esperado                                                           |
| ------ | ------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| BUY-01 | Crear compra        | Crear compra a `DEV-PROVEEDOR ACME` con uno o más artículos. | Compra aprobada; total, detalle y stock actualizados.                        |
| BUY-02 | Compra con concepto | Agregar un detalle sin artículo, con concepto e importe.     | El importe se incluye en el total sin romper el detalle.                     |
| BUY-03 | Pago a proveedor    | Registrar un pago a `DEV-PROVEEDOR ACME`.                    | Pago aparece en historial y saldo pendiente cambia.                          |
| BUY-04 | Cancelar pago       | Cancelar el pago recién creado.                              | Estado pasa a cancelado y el saldo se recalcula.                             |
| BUY-05 | Cancelar compra     | Crear compra temporal y cancelarla.                          | Estado cancelado; verificar que el stock siga la regla vigente del producto. |

## Ventas, facturación y cobros

| ID     | Caso                  | Pasos                                                              | Resultado esperado                                                  |
| ------ | --------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| SAL-01 | Nueva venta pendiente | Crear venta para `DEV-CLIENTE SUR` con `DEV-002`.                  | Venta pendiente visible con total y detalle correctos.              |
| SAL-02 | Revisión              | Revisar la venta pendiente, modificar cantidad o eliminar un ítem. | Total y detalle recalculados; estado correcto.                      |
| SAL-03 | Entrega               | Marcar la venta revisada como entregada/aprobada.                  | Estado cambia y el stock se descuenta según la lógica del producto. |
| SAL-04 | Venta con concepto    | Agregar un concepto sin artículo.                                  | Se suma al total y aparece en ticket/detalle.                       |
| SAL-05 | Facturación           | Crear venta facturable y registrar número de comprobante.          | Se guarda ticket y fecha de facturación.                            |
| SAL-06 | Cobro                 | Registrar cobro para `DEV-CLIENTE TALLER NORTE`.                   | El pago se visualiza en el historial y modifica el saldo.           |
| SAL-07 | Cobro con cheque      | Registrar cobro por cheque con banco, número y fecha de cobro.     | Campos de cheque persisten correctamente.                           |
| SAL-08 | Cancelar cobro        | Cancelar un cobro recién creado.                                   | Estado y saldo se actualizan.                                       |
| SAL-09 | Cancelar venta        | Crear una venta temporal y cancelarla.                             | Estado cancelado; no debe figurar como venta activa.                |

## Reportes y exportaciones

| ID     | Caso                 | Pasos                                             | Resultado esperado                                         |
| ------ | -------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| REP-01 | Reporte de pagos     | Abrir reporte de pagos y aplicar filtro.          | Registros y totales coherentes.                            |
| REP-02 | Reporte de actividad | Abrir reporte de actividad.                       | Compras y ventas visibles y ordenadas.                     |
| REP-03 | Exportar pagos       | Ejecutar exportación de pagos.                    | Se descarga/abre un PDF válido, sin error 500.             |
| REP-04 | Exportar actividades | Ejecutar exportación de actividades.              | PDF válido, datos correctos y formato legible.             |
| REP-05 | Ticket de venta      | Generar ticket de una venta de prueba.            | PDF incluye cliente, artículos, total y usuario correctos. |
| REP-06 | Precios y stock      | Exportar precios, stock y ventas desde Artículos. | Cada exportación completa correctamente.                   |

## Licencias y carga de archivos

| ID     | Caso                     | Pasos                                                             | Resultado esperado                                           |
| ------ | ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------ |
| LIC-01 | Listado                  | Abrir Licencias.                                                  | La licencia actual se muestra sin error.                     |
| LIC-02 | Detalle                  | Abrir el detalle de la licencia actual.                           | Ítems y pagos cargan correctamente.                          |
| LIC-03 | Validación de cotización | Probar el flujo de cotización si hay credenciales y conectividad. | Se muestra un error controlado o se actualiza la cotización. |
| LIC-04 | Carga de comprobante     | Usar un archivo de prueba no sensible.                            | Validar carga, mensaje y manejo de error externo.            |

## Navegación y regresiones visuales

| ID     | Caso             | Pasos                                                                      | Resultado esperado                                     |
| ------ | ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| NAV-01 | Menú completo    | Recorrer todas las entradas del menú.                                      | Todas las rutas cargan correctamente.                  |
| NAV-02 | Links de retorno | Usar botones volver/cancelar en formularios.                               | Vuelve a la lista esperada sin perder datos guardados. |
| NAV-03 | Formularios      | Revisar validaciones de campos requeridos y numéricos.                     | Mensajes claros, sin permitir estados inválidos.       |
| NAV-04 | Tablas           | Probar filtros, ordenamiento, paginación y búsqueda.                       | Los controles responden y no corrompen resultados.     |
| NAV-05 | Navegadores      | Probar al menos Chrome/Edge actuales y el navegador empresarial requerido. | Sin errores visuales o funcionales críticos.           |

## Cierre por major

1. Ejecutar `npm run build-prd`.
2. Ejecutar todos los casos críticos: `SMK-*`, `AUTH-*`, `BUY-*`, `SAL-*`, `REP-*`.
3. Registrar resultados, capturas y errores conocidos.
4. Confirmar que no hay errores nuevos en consola o red.
5. Obtener aprobación funcional antes de comenzar el major siguiente.

## Casos críticos mínimos

Si el tiempo es limitado, ejecutar al menos:

`SMK-01`, `SMK-04`, `AUTH-01`, `MET-01`, `ART-01`, `BUY-01`, `SAL-01`, `SAL-03`, `SAL-06`, `REP-03` y `REP-05`.
