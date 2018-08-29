import { Component, Input, Output } from "@angular/core";
import * as d3 from 'd3';

@Component({
    selector : 'amexio-d3-chart-bar',
    templateUrl:'./bar.component.html'
})
export class AmexioD3BarChartComponent
{



    constructor() { }


    @Input('data') dataSet1: any;
  
    @Input() colors: any;
    
    @Input() svgwidth: any;
  
    @Input() svgheight: any;
  
    @Input() title: any = "";
  
    ngOnInit() {
    //code for bar chart
  
    let svgWidth;
    // = 500;
    let svgHeight;
    // = 300;
  
    if (this.svgwidth) {
      svgWidth = this.svgwidth;
    }
    else {
      svgWidth = 500;
    }
  
    if (svgHeight) {
      svgHeight = this.svgheight;
    }
    else {
      svgHeight = 300;
    }
  
    let barpadding = 5;
  
    let svg = d3.select('#barchart').append("svg")
      .attr('width', svgWidth)
      .attr('height', svgHeight);
  let left = 100; 
  let top = 70;
      let svg1 = d3.select('#barchartlegend').append('svg')
      // .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr("transform", "translate(" + left + "," + top + ")");
    
      var VALUES = [];
      var LABELS = this.dataSet1.label;
      var legendcolors = color;
  
      this.dataSet1.forEach(element => {
        if (element.label) {
          VALUES.push(element.label);
        }
      });
      console.log("VALUES", VALUES);
  
      var legspacing = 25;
  
  
  // var color;
  var predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  // if(this.colors){
  
  // }           
  var color;
  // = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var flag = 3;
  //1
  if (this.dataSet1[0].color) {
  flag = 1;
  }
  //2
  else if (this.colors) {
  flag = 2;
  }
  
  //3
  else {
  flag = 3;
  }
  
  var colorarray1 = [];
  
  switch (flag) {
  case 1:
    this.dataSet1.forEach((element, i) => {
      if (element.color) {
        colorarray1.push(element.color);
      }
      else if (this.colors) {
        colorarray1.push(this.colors[i]);
      }
      else {
        colorarray1.push(predefinedcolors[i]);
      }
    });
    color = d3.scaleOrdinal(colorarray1);
    break;
  
  case 2:
    color = d3.scaleOrdinal(this.colors);
    break;
  
  case 3:
    color = d3.scaleOrdinal(predefinedcolors);
    break;
  }
  
  
  
      var legend = svg1.selectAll(".legend")
                  .data(VALUES)
                  .enter()
                  .append("g");
  
                 legend.append("text")
                .attr("class", "label")
                .attr("y",  40)
                .attr("x", function (d, i) {
                      return i * legspacing + 10;
                  })
                .attr("text-anchor", "start")
                 .text(function (d, i) {
                    return VALUES[i];
                });
  
  
                  legend.append("rect")
                  .attr("fill",
                   function(d, i){
                    return color(i);
                  })
                  .attr("width", 20)
                  .attr("height", 20)
                  .attr("x", function (d, i) {
                      return i * legspacing + 10;
                  })
                  .attr("y", 60);
                   
  
    
    let barWidth = (svgWidth / this.dataSet1.length);
    let barChart = svg.selectAll('rect')
      .data(this.dataSet1)
      .enter()
      .append('rect')
      .attr('y', function (d) {
        return svgHeight - d.value;
      })
      .attr('height', function (d) {
        return d.value;
      })
      .attr('width', barWidth - barpadding)
      .attr('transform', function (d, i) {
        let translate = [barWidth * i, 0]
        return "translate(" + translate + ")";
      })
      .style('fill',
        //  'yellow'
  
        function (d, i) { return color(i) }
      );
  
    var text = svg.selectAll('text')
      .data(this.dataSet1)
      .enter()
      .append('text')
      .text(function (d) {
        return d.value;
      })
      .style('fill', function (d, i) {
        if (d.textcolor) {
          return d.textcolor;
        }
        else {
          return 'black'
        }
      })
      .attr('y', function (d, i) {
        return (
          svgHeight - d.value - 2
        );
      })
      .attr('x', function (d, i) {
        return ((barWidth * i) + 20);
      })
      .attr('transform', function (d, i) {
        let translate = d(i) + barWidth / 2;
        return "translate(" + translate + ")";
      })
      .style('color', 'red');
  
    }
  
  

}