import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'amexio-d3chartlegend',
  templateUrl: './d3chartlegend.component.html',
  styleUrls: ['./d3chartlegend.component.css']
})
export class D3chartlegendComponent implements OnInit {

 /*
  Properties
  name :  data
  datatype : any
  version : 5.2 onwards
  default : none
  description : set data to legend
  */
  @Input('data') legendData;

    /*
  Events
  name : onLegendClick
  version : 5.2 onwards
  description : fire when legend is click
  */
  @Output() onLegendClick: any = new EventEmitter<any>();

  predefinedcolors = [];
  componentId: any;
  constructor() {
    this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  }

  ngOnInit() {
    this.componentId = 'donut'+ this.generateRandomText();
    this.checkColors();
  }

  legendClick(legend: any) {
    debugger;
    this.onLegendClick.emit(legend);
  }


  generateRandomText(){
     let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcddefghijklmonpqrstuvwxyz";
    for(let i = 0; i<5; i++){
      text = text + possible.charAt(Math.floor(Math.random()*possible.length));
    }
     return text;
  }

  checkColors() {
    this.legendData.forEach((element, i) => {
      if (element.color) {
      }
      else {
        element.color = this.predefinedcolors[i];
      }
    });
  }



}
