import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../../_shared/auth/admin-auth.guard';

import { CustomersComponent } from './customers.component';
import { ListComponent } from './list/list.component';
import { SalesComponent } from './sales/sales.component';
import { SaleComponent } from './sale/sale.component';
import { PaymentComponent } from './payment/payment.component';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
    {
        path: "", component: CustomersComponent, children: [
            {
                path: ":page", component: ListComponent,
            },
            {
                path: "venta/:id", component: SaleComponent,
            },
            {
                path: "cobro/:id", component: PaymentComponent,
            },
            {
                path: "ventas/pendientes/:page", canActivate: [AdminAuthGuard], component: SalesComponent,
            },
            {
                path: "ventas/listas/:page", canActivate: [AdminAuthGuard], component: SalesComponent,
            },
            {
                path: "ventas/facturacion/:page", canActivate: [AdminAuthGuard], component: SalesComponent,
            },
            {
                path: "nuevo/1", canActivate: [AdminAuthGuard], component: CustomerComponent,
            },
            {
                path: ":id/:page", component: CustomerComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
