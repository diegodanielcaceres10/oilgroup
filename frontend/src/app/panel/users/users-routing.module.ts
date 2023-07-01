import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminAuthGuard } from '../../_shared/auth/super-admin-auth.guard';

import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
    {
        path: "", canActivate: [SuperAdminAuthGuard], component: UsersComponent, children: [
            {
                path: ":page", canActivate: [SuperAdminAuthGuard], component: ListComponent,
            },
            {
                path: "nuevo/1", canActivate: [SuperAdminAuthGuard], component: UserComponent,
            },
            {
                path: ":username/:page", canActivate: [SuperAdminAuthGuard], component: UserComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
