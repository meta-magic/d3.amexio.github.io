import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {AmexioChartD3Module} from 'amexio-chart-d3';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmexioChartD3Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
