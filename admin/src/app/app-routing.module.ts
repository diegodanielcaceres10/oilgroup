import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './_shared/auth/no-auth.guard';

import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: "login", component: LoginComponent, canActivate: [NoAuthGuard],
    },
    {
        path: "panel", loadChildren: () => import("./panel/panel.module").then(m => m.PanelModule),
    },
    { path: "**", redirectTo: "login", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
