import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

import {AmexioChartD3Module} from 'amexio-chart-d3';
import {AmexioWidgetModule} from 'amexio-ng-extensions';
import { AmexioD3BarChartComponent1 } from './bar/bar.component';

@NgModule({
  declarations: [
    AppComponent,
    AmexioD3BarChartComponent1
  ],
  imports: [
    BrowserModule,
    AmexioChartD3Module,
    FormsModule,
    AmexioWidgetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
