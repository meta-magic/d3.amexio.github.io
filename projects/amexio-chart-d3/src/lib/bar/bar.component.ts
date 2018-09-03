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

  @Output() onLegendClick: any = new EventEmitter<any>();

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
  name : data
  datatype : any
  version : 5.2 onwards
  default : none
  description : provides data to chart
  */
 @Input() legend: boolean = true ;

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
  @Input('width') svgwidth: any = "300";
  /*
    Properties
    name : height
    datatype : any
    version : 5.2 onwards
    default : none
    description : set height to chart
    */
  @Input('height') svgheight: any = "300";
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

  componentId: any;
  ngOnInit() {
    this.componentId = 'donut'+ this.generateRandomText();
    setTimeout(() => {
      this.plotChart();
    }, 2000);

  }

  plotChart() {
    let color;
    let i;
    let left = 100;
    let top = 70;
    let labels = [];
    let legendcolors = color;
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    //defining svg
   // let svg = d3.select("svg"),
   let svg = d3.select("svg");
   let   margin = { top: 20, right: 20, bottom: 30, left: 40 },
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
      })
      .on('mouseover', function (d) {
          tooltip.transition().duration(100).style('opacity', 1);
          tooltip.html(`Value: <span>${d.value}</span>`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
      })
      .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));;
    this.dataset.forEach(element => {
      if (element.label) {
        labels.push(element.label);
      }
    });

    var labelsforlegend = [];
    // var legendcolors = color;
     this.dataset.forEach(element => {
       if (element.label) {
         labelsforlegend.push(element.label);
       }
     });
     labelsforlegend.forEach(element => {
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
//get color according to priority
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

  generateRandomText(){
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcddefghijklmonpqrstuvwxyz";
    for(let i = 0; i<5; i++){
      text = text + possible.charAt(Math.floor(Math.random()*possible.length));
    }
     return text;
  }

  getLegendClick(event: any) {
    this.onLegendClick.emit(event);
  }


}
