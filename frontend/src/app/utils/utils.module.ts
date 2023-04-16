import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { FormComponent } from '../utils/form/form.component';
import { HeaderComponent } from '../utils/header/header.component';
import { NavComponent } from '../utils/nav/nav.component';
import { LoadComponent } from '../utils/load/load.component';
import { DialogModalComponent } from '../utils/dialog-modal/dialog-modal.component';

@NgModule({
    declarations: [
        FormComponent,
        HeaderComponent,
        NavComponent,
        LoadComponent,
        DialogModalComponent,
    ],
    exports: [
        FormComponent,
        HeaderComponent,
        NavComponent,
        LoadComponent,
        DialogModalComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class UtilsModule { }
