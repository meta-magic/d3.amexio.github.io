import { NgModule } from '@angular/core';
import { D3_COMPONENTS } from './amexio-chart-d3-components';
import {FormsModule} from '@angular/forms';
import {  CommonModule } from '@angular/common';
import{DeviceQueryService} from './services/device.query.service'

export * from './services/device.query.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule                                                             
  ],
 
  declarations: D3_COMPONENTS,
  providers: [DeviceQueryService],
  exports: D3_COMPONENTS
})
export class AmexioChartD3Module { }
               