import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_shared/auth/auth.guard';
import { SuperAdminAuthGuard } from '../_shared/auth/super-admin-auth.guard';

import { PanelComponent } from './panel.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './home/report.component';

const routes: Routes = [
    {
        path: "", component: PanelComponent, canActivate: [AuthGuard], children: [
            {
                path: "", component: HomeComponent, canActivate: [AuthGuard],
            },
            {
                path: "articulos", loadChildren: () => import("./articles/articles.module").then(m => m.ArticlesModule),
            },
            {
                path: "proveedores", loadChildren: () => import("./providers/providers.module").then(m => m.ProvidersModule),
            },
            {
                path: "clientes", loadChildren: () => import("./customers/customers.module").then(m => m.CustomersModule),
            },
            {
                path: "usuarios", loadChildren: () => import("./users/users.module").then(m => m.UsersModule),
            },
            {
                path: "reporte/pagos/:page", component: ReportComponent, canActivate: [SuperAdminAuthGuard],
            },
            {
                path: "reporte/actividades/:page", component: ReportComponent, canActivate: [SuperAdminAuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PanelRoutingModule { }
