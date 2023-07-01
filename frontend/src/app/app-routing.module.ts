import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_shared/auth/auth.guard';
import { NoAuthGuard } from './_shared/auth/no-auth.guard';

import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: "login", canActivate: [NoAuthGuard], component: LoginComponent,
    },
    {
        path: "panel", canActivate: [AuthGuard], loadChildren: () => import("./panel/panel.module").then(m => m.PanelModule),
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
