
import { Component, OnInit } from '@angular/core';
import { GroupbarComponent } from '../../groupbar/groupbar.component';
import { AmexioD3BarChartComponent} from '../../bar/bar.component';
import {AmexioD3LineComponent} from '../../line/line.component';
import {AmexioD3DounutChartComponent} from  '../../dounut/dounut.component';
import { ViewDrillableComponent } from '../../base/view.component';

import {
  AfterContentInit, AfterViewInit, ContentChildren,
  ElementRef, EventEmitter, Input, Output, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
@Component({
  selector: 'amexio-drillable',
  templateUrl: './drillable.component.html',
  styleUrls: ['./drillable.component.css']
})


export class DrillableComponent extends ViewDrillableComponent implements OnInit {

  
  constructor() {
     super();
  }

  ComponentDataArray: any
  componentcounter:number=1;
  disableFlag:boolean= false;
 

  ngOnInit() {


  }

  ngAfterViewInit() {

    this.ComponentDataArray = this.getComponentData();
    this.getData(this.ComponentDataArray);

  }
  getData(data: any) {

     data.forEach(element => {

  if (element.level !== 1) {
        element.drillableFlag = false;
        element.drillableEvent.subscribe((eventdata: any) => {
          this.hideUI(eventdata);
          this.ShowUI(eventdata);

        })
 } 
 else {
        this.disableFlag = false;
        element.drillableEvent.subscribe((eventdata: any) => {
          this.hideUI(eventdata);
          this.ShowUI(eventdata);
        })
      }
    });

  }

  hideUI(eventRef: any) {
    this.ComponentDataArray.forEach(element => {
      if (element.level == eventRef.ref.level) {
        eventRef.ref.drillableFlag = false;

      }
    });

  }

  ShowUI(eventRef: any) {

  

    this.ComponentDataArray.forEach(element => {
      if (eventRef.ref.target == element.level) {
        this.disableFlag = true;
     
        element.drillableFlag = true;
        element.fetchData(eventRef.node);
        this.componentcounter = element.level;
      }

    });

    if (this.componentcounter == eventRef.ref.level) {
            eventRef.ref.drillableFlag = true;
    }

  } 


  previouschartClick(event: any) {

    let chartLevel = this.componentcounter - 1;

    this.ComponentDataArray.forEach(element => {
      if (chartLevel == element.level) {

        element.drillableFlag = true;
        element.drawChart();

      } else if (this.componentcounter == element.level) {
        element.drillableFlag = false;
      }
    });
    if (this.componentcounter == 2) {
         this.disableFlag = false;
       
    }
    this.componentcounter = chartLevel;
  }

}
