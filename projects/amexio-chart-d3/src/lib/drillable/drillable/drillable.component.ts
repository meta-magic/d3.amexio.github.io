
import { Component, OnInit } from '@angular/core';
import { ViewDrillableComponent } from '../../base/view.component';

import {
  AfterContentInit, AfterViewInit, ContentChildren,
  ElementRef, EventEmitter, Input, Output, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import { HostListener } from '@angular/core';
@Component({
  selector: 'amexio-drillable',
  templateUrl: './drillable.component.html',
  styleUrls: ['./drillable.component.css']
})


export class DrillableComponent extends ViewDrillableComponent implements OnInit {

  mouseLocation: { left: number; top: number } = { left: 0, top: 0 };
  contextmenuFlag: boolean;
  contextStyle: any;
  ComponentDataArray: any
  componentcounter: number = 1;
  disableFlag: boolean = false;
  arrayofsameLevel: any;
  eventData: any;
  rightClickNodeData: any;
  posixUp: boolean;
  levelArray: any;
  constructor() {
    super();
  }

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
          this.sameLevelChart(eventdata);
          this.ShowUI(eventdata);


        })
      }
      else {
        this.disableFlag = false;
        element.drillableEvent.subscribe((eventdata: any) => {
          this.hideUI(eventdata);
          this.sameLevelChart(eventdata);
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
    this.eventData = [];
    this.eventData = eventRef;
    this.ComponentDataArray.forEach(element => {
      if (eventRef.ref.target == element.level) {
        if (this.arrayofsameLevel.length == 1) {
          this.disableFlag = true;
          element.drillableFlag = true;
          element.fetchData(eventRef.node);
          this.componentcounter = element.level;
        }
        else {
          this.contextmenuFlag = true;
          this.mouseLocation.left = eventRef.event.clientX;
          this.mouseLocation.top = eventRef.event.clientY;
          this.contextStyle = this.getContextMenuStyle();
        }
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


  sameLevelChart(eventRef: any) {
  
    this.arrayofsameLevel = [];
    this.ComponentDataArray.forEach(element => {
      if (eventRef.ref.target == element.level) {
        this.arrayofsameLevel = this.arrayofsameLevel.concat(element);

      }

    });
  }

  //Method Creates style if two same targets found.
  getContextMenuStyle() {
    return {
      'cursor': 'default',
      'position': 'fixed',
      'display': this.contextmenuFlag ? 'block' : 'none',
      'left': this.mouseLocation.left + 'px',
      'top': this.mouseLocation.top + 'px',
      'box-shadow': '1px 1px 2px #000000',
      'width': '15%',
    };
  }



  getListPosition(elementRef: any): boolean {
    const height = 240;
    if ((window.screen.height - elementRef.getBoundingClientRect().bottom) < height) {
      return true;
    } else {
      return false;
    }
  }

  onContextNodeClick(event: any) {
    this.componentcounter = 0;
    this.contextmenuFlag = false;
    this.eventData.ref.drillableFlag = false;
    this.disableFlag = true;
    event.drillableFlag = true;
    event.fetchData(this.eventData.node);
    this.componentcounter = event.level;

    if (this.componentcounter == this.eventData.ref.level) {
      this.eventData.ref.drillableFlag = true;
    }
  }

  onCloseClick() {
    this.contextmenuFlag = false;
  }

}
