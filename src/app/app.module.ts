import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {HttpModule} from "@angular/http";
import { AppComponent } from './app.component';
// import {AmexioD3BarChartComponent1} from '../../projects/amexio-chart-d3/src/lib/bar/bar.component';
import {AmexioChartD3Module} from 'amexio-chart-d3';
import {AmexioWidgetModule} from 'amexio-ng-extensions';
import { DeviceQueryService } from 'projects/amexio-chart-d3/src/lib/services/device.query.service';
import {CommanDataService} from 'projects/amexio-chart-d3/src/lib/services/comman.data.service'
@NgModule({
  declarations: [
    AppComponent,
    // AmexioD3BarChartComponent1
  ],
  imports: [
    BrowserModule,HttpModule,HttpClientModule,
    AmexioChartD3Module,
    FormsModule,
    AmexioWidgetModule
  ],
  providers: [DeviceQueryService, CommanDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
