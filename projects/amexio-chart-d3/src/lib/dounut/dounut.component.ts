import { Component, Input, Output } from "@angular/core";
import * as d3 from 'd3';

@Component({
    selector : 'amexio-d3-chart-donut',
    templateUrl:'./dounut.component.html'
})
export class AmexioD3DounutChartComponent
{


    constructor() {
    }
 
    @Input('data') dataset: any;
 
    @Input() colors: any;
    
    @Input() svgwidth: any;
 
    @Input() svgheight: any;
 
    @Input() title: any = "";

   ngOnInit() {
     
     //secondarily defined
     var predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  
     var flag =3;
     var color;
 
 //1
 if(this.dataset[0].color)
 {
   flag = 1;
 }
     //2
 else if(this.colors){
   flag = 2;
 }
 
     //3
 else{
   flag = 3;
 }
 
 var  colorarray1 = [];
 
 switch(flag){
   case 1:
   this.dataset.forEach((element, i) => {
     if(element.color)
     {
      colorarray1.push(element.color);
     }
     else if(this.colors){
       colorarray1.push(this.colors[i]);
     }
     else{
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
  
     let svgWidth;
     //= 600;
     let svgHeight;
     // = 600;
       
    if(this.svgwidth){
 svgWidth = this.svgwidth;
    }
    else{
 svgWidth = 600;
    }
  
    if(this.svgheight){
      svgHeight = this.svgheight;
    }
    else{
      svgHeight = 600;
    }
 


//111
let left = 0; 
let top = 0;
    let svg1 = d3.select('#donutchartlegend').append('svg')
    // .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr("transform", "translate(" + left + "," + top + ")");
  
    var VALUES = [];
    var LABELS = this.dataset.label;
    var legendcolors = color;

    this.dataset.forEach(element => {
      if (element.label) {
        VALUES.push(element.label);
      }
    });
    console.log("VALUES", VALUES);

    var legspacing = 25;

//112


var legend = svg1.selectAll(".legend")
.data(VALUES)
.enter()
.append("g");

legend.append("text")
.attr("class", "label")
.attr("x",  90)
.attr("y", function (d, i) {
    return i * legspacing + 12;
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
.attr("y", function (d, i) {
    return i * legspacing ;
})
.attr("x", 60);
 //////


     //var outerRadius=svgWidth/2;
     var outerRadius=svgWidth/4;
 
     var innerRadius=svgWidth/8;
 
     let svg = d3.select('#donut').append('svg')
     .attr('width', svgWidth)
     .attr('height', svgHeight)
   .append('g')
      .attr(
         // 'transform','translate('+ 400 +','+ 400 +')'
         'transform','translate('+ svgWidth/2 +','+  svgHeight/2 +')'
      );
 
      var pie=d3.pie()
      .value(function(d){return d.value})
      .sort(null);
      //.padAngle(.03);
 
      var arc=d3.arc()
     .outerRadius(outerRadius)
     .innerRadius(innerRadius);
 //set path(coordinates) for pie
      var path=svg.selectAll('path')
      .data(pie(this.dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d,i){
        return color(d.data.label);
    })
 
 //print text on donut
 var text=svg.selectAll('text')
           .data(pie(this.dataset))
           .enter()
           .append("text")
           .transition()
           .duration(200)
           .attr("transform", function (d) {
               return "translate(" + arc.centroid(d) + ")";
           })
           .attr("dy", ".4em")
           .attr("text-anchor", "middle")
           .text(function(d){
               return d.data.value+"%";
           })
           .style('fill', 
           function(d){
            if(d.data.textcolor){
              return d.data.textcolor;
            }
            else{
              return 'black'
            }
             // return d.data.value+"%";
         })
         .style('font-weight', 'bold')
         .style( 'font-size','12px');
  
   }
 


}