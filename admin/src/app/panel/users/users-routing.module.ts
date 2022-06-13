import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminAuthGuard } from '../../_shared/auth/super-admin-auth.guard';

import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
    {
        path: "", component: UsersComponent, canActivate: [SuperAdminAuthGuard], children: [
            {
                path: ":page", component: ListComponent, canActivate: [SuperAdminAuthGuard],
            },
            {
                path: "nuevo/1", component: UserComponent, canActivate: [SuperAdminAuthGuard],
            },
            {
                path: ":username/:page", component: UserComponent, canActivate: [SuperAdminAuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
