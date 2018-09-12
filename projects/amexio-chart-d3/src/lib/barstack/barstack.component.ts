import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'amexio-d3-chart-barstack',
  templateUrl: './barstack.component.html',
  styleUrls: ['./barstack.component.css']
})
export class BarstackComponent implements OnInit {

  legendArray: any[];
  keyArray: any[];
  predefinedcolors: any[]
  legends: any[];
  charttype: string;
  componentId: string;
  possible: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcddefghijklmonpqrstuvwxyz";
  data: any[];
  @Input('data') data1: any
  @Input() barwidth: number = 0;
  @Input() title: String = "";
  @Input() legend: boolean = true;
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @ViewChild('chartId') chartId: ElementRef;
  @Output() onLegendClick: any = new EventEmitter<any>();

  constructor() {
    this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  }

  ngOnInit() {
    this.transformData(this.data1);
    this.componentId = this.charttype + "-" + this.generateId();
    setTimeout(() => {
      this.plotChart();
    }, 0);
  }

  generateId() {
    let id = "";
    for (let i = 0; i < 5; i++) {
      id = id + this.possible
        .charAt(Math.floor(Math.random() * this.possible.length));
    }
    id = id + "-" + new Date().getTime();
    return id;
  }

  transformData(data1: any) {
    this.keyArray = [];
    this.legendArray = [];
    this.data1.forEach((element, i) => {
      if (i == 0) {
        element.forEach((innerelement, index) => {
          if (index > 0) {
            this.legendArray[innerelement] = { 'data': [] };
            this.keyArray.push(innerelement);
          }
        });
      }
    });

    let tempinnerarray: any[];
    tempinnerarray = [];
    data1.forEach((element, index) => {

      if (index > 0) {
        let obj: any = {};
        element.forEach((innerelement, innerindex) => {
          if (innerindex >= 0) {
            const key = this.keyArray[innerindex - 1];
            obj[key] = element[innerindex];
            const legenddata = this.legendArray[key];
            if (legenddata) {
              legenddata.data.push({ 'value': element[innerindex], 'label': element[0] });
            }
          }
        });

        tempinnerarray.push(obj);
      }
    });

    this.data = [];
    tempinnerarray.forEach(element => {
      this.data.push(element);
    });
    this.legends = []
    this.keyArray.forEach((element, index) => {
      const legenddata = this.legendArray[element];
       let object = { 'label': element, 'color': this.predefinedcolors[index], 'data': legenddata.data };
      this.legends.push(object);
    });
  }

  plotChart() {
    let margin = { top: 20, right: 30, bottom: 30, left: 60 };

    let colors = this.predefinedcolors;

    this.svgwidth = this.chartId.nativeElement.offsetWidth;

    let data;
    data = this.data;

    let series = d3.stack()
      .keys(this.keyArray)
      .offset(d3.stackOffsetDiverging)
      (this.data);

    let svg =
      d3.select("svg"),
      width = +this.svgwidth - margin.left - margin.right,
      height = +svg.attr("height");

    let x = d3.scaleBand()
      .domain(data.map((d) => {
        //year value    
        return d[Object.keys(d)[0]];
      }))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    let y = d3.scaleLinear()
      .domain([d3.min(this.stackMin(series)), d3.max(this.stackMax(series))])
      .rangeRound([height - margin.bottom, margin.top]);

    let z = d3.scaleOrdinal(d3.schemeCategory10);
    //logic fr dynamic barwidth 
    if (this.barwidth > 0) {
      this.barwidth = this.barwidth;
    }
    else {
      this.barwidth = x.bandwidth;
    }

    svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
      .attr("fill", (d, index) => {
        return colors[index];
      })
      .selectAll("rect")
      .data((d) => { return d; })
      .enter().append("rect")
      .attr("width",
        x.bandwidth
      )
      .attr("x", (d) => {
        return x(+d.data[Object.keys(d.data)[0]]);
      })
      .attr("y", (d) => { return y(d[1]); })
      .attr("height", (d) => { return y(d[0]) - y(d[1]); })

    svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
  }

  stackMin(serie) {
    return d3.min(serie, function (d) { return d[0]; });
  }

  stackMax(serie) {
    return d3.max(serie, function (d) { return d[1]; });
  }

  resize() {

  }

  legendClick(event: any) {
    const legendNode = JSON.parse(JSON.stringify(event));
    delete legendNode.color;
    this.onLegendClick.emit(legendNode);

  }

}
