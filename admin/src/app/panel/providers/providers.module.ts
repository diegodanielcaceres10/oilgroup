import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../../utils/utils.module';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProvidersComponent } from './providers.component';
import { ListComponent } from './list/list.component';
import { BuyComponent } from './buy/buy.component';
import { PaymentComponent } from './payment/payment.component';
import { ProviderComponent } from './provider/provider.component';

@NgModule({
    declarations: [
        ProvidersComponent,
        ListComponent,
        BuyComponent,
        PaymentComponent,
        ProviderComponent,
    ],
    imports: [
        CommonModule,
        ProvidersRoutingModule,
        UtilsModule,
    ]
})
export class ProvidersModule { }
