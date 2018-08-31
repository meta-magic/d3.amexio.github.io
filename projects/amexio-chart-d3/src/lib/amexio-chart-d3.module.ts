import { NgModule } from '@angular/core';
import { D3_COMPONENTS } from './amexio-chart-d3-components';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    FormsModule,
    BrowserModule                                                             
  ],
  declarations: D3_COMPONENTS,
  exports: D3_COMPONENTS
})
export class AmexioChartD3Module { }
               