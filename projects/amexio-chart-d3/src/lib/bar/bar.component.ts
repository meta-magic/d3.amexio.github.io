import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as d3 from 'd3';

@Component({
  selector: 'amexio-d3-chart-bar',
  templateUrl: './bar.component.html'
})
export class AmexioD3BarChartComponent {

  colorIndex: number = 0;
  labelstack = [];
  legendArray = [];

  /*
  Properties
  name : data
  datatype : any
  version : 5.2 onwards
  default : none
  description : provides data to chart
  */
  @Input('data') dataset: any;
 /*
  Properties
  name : color
  datatype : string
  version : 5.2 onwards
  default : none
  description : set color to chart
  */
  @Input('color') colors: string[];
/*
  Properties
  name : width
  datatype : any
  version : 5.2 onwards
  default : none
  description : set width to chart
  */
  @Input('width') svgwidth: any;
/*
  Properties
  name : height
  datatype : any
  version : 5.2 onwards
  default : none
  description : set height to chart
  */
  @Input('height') svgheight: any;
  /*
  Properties
  name : title
  datatype : any
  version : 5.2 onwards
  default : none
  description : set title to chart
  */
  @Input() title: any = "";
 
  colorforhtml = [];
  predefinedcolors = [];

  constructor() {
    this.colors = [];
    this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  }

  ngOnInit() {

    setTimeout(() => {
      this.plotChart();
    }, 0);

  }
                      
  plotChart() {
    let color;
    let i;
    let left = 100;
    let top = 70;
    let labels = [];
    let legendcolors = color;
    //defining svg
    let svg = d3.select("svg"),
      margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;
    //xaxis yaxis letiable
    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);
    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //setting content for x and y axis
    x.domain(this.dataset.map(function (d) { return d.label; }));
    y.domain([0, d3.max(this.dataset, function (d) { return d.value; })]);
    // add x axis to svg
    g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    //add y axis to svg
    g.append("g").call(d3.axisLeft(y).ticks(10))
    this.initializeData();
    //add bar chart
    g.selectAll(".bar")
      .data(this.dataset)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.label); })
      .attr("y", function (d) { return y(d.value); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.value); })
      .style("fill", function (d) {
        return d.color;
      });
    this.dataset.forEach(element => {
      if (element.label) {
        labels.push(element.label);
      }
    });
    labels.forEach(element => {
      this.labelstack.push(element);
    });
    this.legendArray = [];
    for (i = 0; i < this.labelstack.length; i++) {
      let obj = {};
      obj['label'] = this.labelstack[i];
      if (this.colorforhtml[i]) {
        obj['color'] = this.colorforhtml[i];
      }
      else
        obj['color'] = 'black';
      this.legendArray.push(obj);
    }
  }

  getColors(object: any) {
    if (object.color) {
      this.colorforhtml.push(object.color);
      return object.color;
    }
    else if (this.colors.length > this.colorIndex) {
      const color = this.colors[this.colorIndex];
      this.colorIndex++;
      this.colorforhtml.push(color);
      return color;
    }
    else if ((this.colors.length > 0) && (this.colors.length <= this.colorIndex)) {
      this.colorIndex = 0;
      const color = this.colors[this.colorIndex];
      this.colorIndex++;
      this.colorforhtml.push(color);
      return color;
    }
    else {
      const color = this.predefinedcolors[this.colorIndex];
      this.colorIndex++;
      this.colorforhtml.push(color);
      return color;
    }
  }

  initializeData() {
    this.dataset.forEach(element => {
      element.color = this.getColors(element);
    });
  }

}