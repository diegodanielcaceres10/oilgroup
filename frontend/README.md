# OilgroupAppAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3 and has since been upgraded to Angular 22.

## Requirements

To run the frontend outside Docker, install Node.js 22.22.3 or later and npm. Angular CLI 22 supports Node.js `^22.22.3`, `^24.15.0` or `>=26`. The Docker setup uses the `node:22-bookworm` image, so it does not need a local Node.js installation.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Docker development environment

From the repository root, run `docker compose up --build`. The frontend is available at `http://localhost:6004/` and source changes under `frontend/` trigger a reload. Stop it with `docker compose down`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/web/` directory. For a production build, run `npm run build-prd` (equivalent to `ng build --configuration=production`).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
