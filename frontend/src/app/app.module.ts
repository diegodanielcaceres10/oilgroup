import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UtilsModule } from './utils/utils.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import localeEsAr from '@angular/common/locales/es-AR';
import { LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsAr);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        UtilsModule,
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'es-AR' }],
    bootstrap: [AppComponent]
})
export class AppModule { }
