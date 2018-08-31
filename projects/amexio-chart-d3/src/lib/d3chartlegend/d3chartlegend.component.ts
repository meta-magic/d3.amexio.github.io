import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'amexio-d3chartlegend',
  templateUrl: './d3chartlegend.component.html',
  styleUrls: ['./d3chartlegend.component.css']
})
export class D3chartlegendComponent implements OnInit {

  @Input('data') legendData;

  @Output() onLegendClick: any = new EventEmitter<any>();

  predefinedcolors = [];

  constructor() {
    this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  }

  ngOnInit() {
    this.checkColors();
  }

  legendClick(legend: any) {
    this.onLegendClick.emit(legend);
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
