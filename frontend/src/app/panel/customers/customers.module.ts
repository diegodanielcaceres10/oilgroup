import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { ListComponent } from './list/list.component';
import { SalesComponent } from './sales/sales.component';
import { SaleComponent } from './sale/sale.component';
import { PaymentComponent } from './payment/payment.component';
import { CustomerComponent } from './customer/customer.component';


@NgModule({
    declarations: [
        CustomersComponent,
        ListComponent,
        SalesComponent,
        SaleComponent,
        PaymentComponent,
        CustomerComponent,
    ],
    imports: [
        CommonModule,
        CustomersRoutingModule,
        UtilsModule,
    ]
})
export class CustomersModule { }
