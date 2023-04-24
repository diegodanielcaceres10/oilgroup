import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LicenseRoutingModule } from './license-routing.module';
import { LicenseComponent } from './license.component';
import { ListComponent } from './list/list.component';

@NgModule({
    declarations: [LicenseComponent, ListComponent],
    imports: [
        CommonModule,
        LicenseRoutingModule
    ]
})
export class LicenseModule { }
