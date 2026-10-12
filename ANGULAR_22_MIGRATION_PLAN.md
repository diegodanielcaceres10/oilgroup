# Plan de migración: Angular 11 a Angular 22

## Objetivo

Actualizar `frontend/` de Angular 11.2 a Angular 22 de forma gradual, verificable y reversible. La migración incluye Angular, Angular CLI, TypeScript, Node.js, herramientas de calidad y pruebas end-to-end.

No se debe actualizar directamente de Angular 11 a 22 ni usar `--force` para ignorar conflictos de dependencias.

## Estado inicial

| Componente | Versión / estado actual |
| --- | --- |
| Angular y Angular CLI | 11.2.x |
| TypeScript | 4.1.x |
| RxJS | 6.6.x |
| Node para Docker web | 14 |
| Testing unitario | Karma + Jasmine |
| E2E | Protractor |
| Lint | TSLint |
| Arquitectura | `NgModule` y lazy-loading por módulos |

## Requisitos de destino

Angular 22 requiere una versión moderna de Node y TypeScript. Confirmar las versiones exactas antes de comenzar cada tramo en la [tabla oficial de compatibilidad](https://angular.dev/reference/versions).

Al momento de preparar este documento, Angular 22 requiere:

- Node.js `^22.22.3`, `^24.15.0` o `^26.0.0`.
- TypeScript `>=6.0.0 <6.1.0`.
- RxJS `^6.5.3` o `^7.4.0`.

Para el destino se recomienda Node 22 LTS y RxJS 7.

## Principios de ejecución

1. Crear una rama dedicada por tramo y un commit por major de Angular.
2. Actualizar al último patch de cada major, sin saltear majors.
3. Ejecutar las migraciones oficiales de `ng update`; no editar manualmente sus cambios antes de revisar el resultado.
4. Mantener una versión funcional y desplegable al terminar cada major.
5. No combinar cambios funcionales, rediseño visual o migración a standalone con el salto inicial de framework.
6. No usar `--force` sin documentar la incompatibilidad, el impacto y la alternativa descartada.

## Preparación

### 1. Línea base funcional

Antes de tocar dependencias, registrar evidencia de estos flujos sobre el entorno Docker:

- Login y persistencia de sesión.
- ABM de usuarios, clientes, proveedores y artículos.
- Stock, precios y medidas.
- Compras y pagos a proveedores.
- Ventas, revisión, entrega, facturación y cobros.
- Métricas, reportes y exportación de PDF.
- Carga de archivos de licencia.

Documentar URL, payload esperado y respuesta de cada endpoint crítico. Los smoke tests deben ejecutarse contra el backend y la DB locales.

### 2. Copia de seguridad y aislamiento

```bash
git status
docker compose exec -T db sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" oilgroup' > backup-before-angular-migration.sql
```

No correr `docker compose down -v` durante la migración: elimina el volumen de MySQL local.

### 3. Limpiar el entorno Node

Usar una instalación limpia de dependencias en cada major, preservando el lockfile hasta que `ng update` lo modifique:

```bash
cd frontend
Remove-Item -Recurse -Force node_modules
```

> En PowerShell, ejecutar estas instrucciones solamente después de confirmar que no hay cambios locales no versionados dentro de `frontend/`.

## Secuencia de actualización

Actualizar un major a la vez. En cada paso usar la versión de Node compatible con ese major, instalar dependencias y ejecutar la migración:

```bash
npx ng update @angular/cli@^<major> @angular/core@^<major> --create-commits
```

La opción `--create-commits` permite aislar y revertir las migraciones generadas por el CLI. Revisar el resultado antes de continuar.

| Tramo | Majors | Node recomendado durante el tramo | Objetivo |
| --- | --- | --- | --- |
| A | 11 → 12 → 13 → 14 → 15 | Node 14, luego 16 | Salir de Angular 11 y estabilizar builders/configuración. |
| B | 15 → 16 → 17 → 18 → 19 | Node 16, luego 18/20 | Actualizar TypeScript y dependencias del ecosistema. |
| C | 19 → 20 → 21 → 22 | Node 20, luego 22 | Adoptar tooling actual y alcanzar Angular 22. |

Consultar el [Update Guide oficial](https://angular.dev/update-guide) para cada salto, seleccionando Windows y el nivel de complejidad apropiado.

### Checklist por major

1. Elegir la versión de Node compatible con el major de destino.
2. Ejecutar `npm ci` si el lockfile sigue siendo válido; si la migración lo actualiza, ejecutar `npm install` y revisar el diff.
3. Ejecutar `npx ng update @angular/cli@^<major> @angular/core@^<major> --create-commits`.
4. Resolver errores de compilación y tipos sin usar `skipLibCheck` como solución permanente.
5. Ejecutar pruebas y smoke tests.
6. Construir cada configuración de deploy:

   ```bash
   npm run build-prd
   npm run build-hom
   npm run build-qua
   npm run build-dev
   ```

7. Validar que `baseHref` y los archivos de entorno siguen apuntando a los paths correctos.
8. Registrar cambios incompatibles, decisiones y pendientes en el PR.

## Cambios específicos que requieren trabajo

### RxJS

El código usa `Observable.prototype.toPromise()` en varios servicios. Con RxJS 7 todavía puede funcionar, pero debe reemplazarse por `firstValueFrom()` o `lastValueFrom()` antes de evaluar RxJS 8.

Ejemplo:

```ts
// Antes
const response = await this.http.get(url).toPromise();

// Después
import { firstValueFrom } from 'rxjs';

const response = await firstValueFrom(this.http.get(url));
```

No cambiar semántica sin revisar el observable: para streams que no completan, `firstValueFrom` y `lastValueFrom` no son equivalentes.

### Lint

TSLint está discontinuado. Migrar a ESLint después de estabilizar Angular, usando `@angular-eslint`. Remover el builder `@angular-devkit/build-angular:tslint` de `angular.json` solo cuando `npm run lint` haya sido reemplazado y validado.

### E2E

Protractor está discontinuado. Reemplazarlo por Playwright o Cypress; Playwright es la recomendación para nuevos tests de navegador.

Primero implementar escenarios críticos de login, ventas y facturación, y recién entonces remover Protractor.

### Arquitectura Angular

Los `NgModule` actuales siguen soportados. No es obligatorio migrar a standalone para llegar a Angular 22.

La migración a standalone debe ser una iniciativa posterior y separada: primero actualizar, estabilizar y medir; después migrar pantallas o dominios progresivamente.

### Dependencias de terceros

Auditar antes del tramo C:

- `@amcharts/amcharts4` y complementos.
- `moment`.
- Paquetes de exportación de archivos.
- Tipos de Node/Jasmine/Karma.

Confirmar peer dependencies para la combinación Angular, TypeScript y RxJS de cada major. No actualizar todas las librerías arbitrariamente en el mismo commit que Angular.

### Navegadores y polyfills

Angular 22 define soporte de navegadores mediante Baseline. Confirmar que los navegadores requeridos por clientes de Oilgroup estén dentro de la política vigente y revisar `src/polyfills.ts` antes de eliminar cualquier polyfill.

## Docker

El Dockerfile del frontend usa Node 14 para compatibilidad con Angular 11. Mantenerlo hasta que el proyecto complete los majors que requieren Node superior.

Al alcanzar Angular 22, actualizar `docker/web/Dockerfile` a una imagen Node 22 compatible y validar:

```bash
docker compose build web
docker compose up -d web
```

No cambiar Node 14 a Node 22 mientras el frontend siga en Angular 11: esa combinación no es compatible.

## Criterios de aceptación

La migración se considera completa cuando:

- `ng version` muestra Angular CLI, Angular y TypeScript compatibles con Angular 22.
- `npm run build-prd`, `build-hom`, `build-qua` y `build-dev` finalizan correctamente.
- Los tests unitarios y E2E de reemplazo pasan en CI.
- Los flujos funcionales críticos pasan contra el backend local Dockerizado.
- El Dockerfile web usa una versión de Node compatible con Angular 22.
- TSLint y Protractor ya no forman parte del pipeline.
- El lockfile está versionado y `npm ci` es reproducible.

## Estrategia de rollback

Si un major no puede estabilizarse:

1. Volver al commit anterior generado por `ng update`.
2. Restaurar `package.json` y `package-lock.json` del último commit verde.
3. Usar la imagen Docker de Node correspondiente a ese major.
4. Abrir un issue con el error, dependencia bloqueante, impacto y próximo paso.

No continuar hacia el major siguiente con fallas conocidas en build, autenticación, ventas o exportaciones.
