import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../../_shared/auth/admin-auth.guard';

import { ProvidersComponent } from './providers.component';
import { ListComponent } from './list/list.component';
import { BuyComponent } from './buy/buy.component';
import { PaymentComponent } from './payment/payment.component';
import { ProviderComponent } from './provider/provider.component';

const routes: Routes = [
    {
        path: "", component: ProvidersComponent, canActivate: [AdminAuthGuard], children: [
            {
                path: ":page", component: ListComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "compra/:id", component: BuyComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "pago/:id", component: PaymentComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: "nuevo/1", component: ProviderComponent, canActivate: [AdminAuthGuard],
            },
            {
                path: ":id/:page", component: ProviderComponent, canActivate: [AdminAuthGuard],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProvidersRoutingModule { }
