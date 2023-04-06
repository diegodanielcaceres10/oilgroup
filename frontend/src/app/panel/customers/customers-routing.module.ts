import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_shared/auth/auth.guard';
import { AdminAuthGuard } from '../../_shared/auth/admin-auth.guard';

import { CustomersComponent } from './customers.component';
import { ListComponent } from './list/list.component';
import { SalesComponent } from './sales/sales.component';
import { SaleComponent } from './sale/sale.component';
import { PaymentComponent } from './payment/payment.component';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
    {
        path: "", component: CustomersComponent, canActivate: [AuthGuard], children: [
            {
                path: ":page", component: ListComponent, canActivate: [AuthGuard],
            },
            {
                path: "venta/:id", component: SaleComponent, canActivate: [AuthGuard],
            },
            {
                path: "cobro/:id", component: PaymentComponent, canActivate: [AuthGuard],
            },
            {
                path: "ventas/pendientes/:page", component: SalesComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "ventas/listas/:page", component: SalesComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "ventas/facturacion/:page", component: SalesComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "nuevo/1", component: CustomerComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: ":id/:page", component: CustomerComponent, canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
