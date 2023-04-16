import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { UserComponent } from './user/user.component';

@NgModule({
    declarations: [
        UsersComponent,
        ListComponent,
        UserComponent,
    ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        UtilsModule,
    ]
})
export class UsersModule { }
