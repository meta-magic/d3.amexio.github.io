import { NgModule } from '@angular/core';
import { D3_COMPONENTS } from './amexio-chart-d3-components';
import {FormsModule} from '@angular/forms';
import {  CommonModule } from '@angular/common';
@NgModule({
  imports: [
    FormsModule,
    CommonModule                                                             
  ],
  declarations: D3_COMPONENTS,
  exports: D3_COMPONENTS
})
export class AmexioChartD3Module { }
               