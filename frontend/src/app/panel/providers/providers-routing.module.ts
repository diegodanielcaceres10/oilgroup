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
        path: "", canActivate: [AdminAuthGuard], component: ProvidersComponent, children: [
            {
                path: ":page", canActivate: [AdminAuthGuard], component: ListComponent,
            },
            {
                path: "compra/:id", canActivate: [AdminAuthGuard], component: BuyComponent,
            },
            {
                path: "pago/:id", canActivate: [AdminAuthGuard], component: PaymentComponent,
            },
            {
                path: "nuevo/1", canActivate: [AdminAuthGuard], component: ProviderComponent,
            },
            {
                path: ":id/:page", canActivate: [AdminAuthGuard], component: ProviderComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProvidersRoutingModule { }
