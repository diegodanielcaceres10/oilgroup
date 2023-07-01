import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenseAuthGuard } from '../_shared/auth/license-auth.guard';
import { SuperAdminAuthGuard } from '../_shared/auth/super-admin-auth.guard';

import { PanelComponent } from './panel.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './home/report.component';

const routes: Routes = [
    {
        path: "", component: PanelComponent, children: [
            {
                path: "", component: HomeComponent,
            },
            {
                path: "articulos", canActivate: [LicenseAuthGuard], loadChildren: () => import("./articles/articles.module").then(m => m.ArticlesModule),
            },
            {
                path: "clientes", canActivate: [LicenseAuthGuard], loadChildren: () => import("./customers/customers.module").then(m => m.CustomersModule),
            },
            {
                path: "proveedores", canActivate: [LicenseAuthGuard], loadChildren: () => import("./providers/providers.module").then(m => m.ProvidersModule),
            },
            {
                path: "usuarios", canActivate: [LicenseAuthGuard], loadChildren: () => import("./users/users.module").then(m => m.UsersModule),
            },
            {
                path: "licencia", loadChildren: () => import("./license/license.module").then(m => m.LicenseModule),
            },
            {
                path: "reporte/pagos/:page", canActivate: [LicenseAuthGuard, SuperAdminAuthGuard], component: ReportComponent,
            },
            {
                path: "reporte/actividades/:page", canActivate: [LicenseAuthGuard, SuperAdminAuthGuard], component: ReportComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelRoutingModule { }
