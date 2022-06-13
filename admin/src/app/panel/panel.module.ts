import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsModule } from '../utils/utils.module';

import { PanelRoutingModule } from './panel-routing.module';
import { PanelComponent } from './panel.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './home/report.component';

@NgModule({
    declarations: [
        PanelComponent,
        HomeComponent,
        ReportComponent,
    ],
    imports: [
        CommonModule,
        PanelRoutingModule,
        UtilsModule,
    ]
})
export class PanelModule { }
