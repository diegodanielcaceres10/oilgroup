import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';

import { LicenseRoutingModule } from './license-routing.module';
import { LicenseComponent } from './license.component';
import { ListComponent } from './list/list.component';
import { PaymentsComponent } from './payments/payments.component';

@NgModule({
    declarations: [LicenseComponent, ListComponent, PaymentsComponent],
    imports: [
        CommonModule,
        LicenseRoutingModule,
        UtilsModule,
    ]
})
export class LicenseModule { }
