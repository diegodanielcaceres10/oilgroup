import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';

import { LicenseRoutingModule } from './license-routing.module';
import { LicenseComponent } from './license.component';
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [LicenseComponent, ListComponent],
    imports: [
        CommonModule,
        LicenseRoutingModule,
        UtilsModule,
    ]
})
export class LicenseModule { }
