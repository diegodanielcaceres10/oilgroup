import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminAuthGuard } from '../../_shared/auth/super-admin-auth.guard';
import { SystemGuard } from '../../_shared/auth/system.guard';

import { LicenseComponent } from './license.component';
import { ListComponent } from './list/list.component';
import { PaymentsComponent } from './payments/payments.component';

const routes: Routes = [
    {
        path: "", component: LicenseComponent, canActivate: [SuperAdminAuthGuard], children: [
            {
                path: ":page", component: ListComponent, canActivate: [SuperAdminAuthGuard],
            },
            {
                path: ":id/:page", component: PaymentsComponent, canActivate: [SystemGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LicenseRoutingModule { }
