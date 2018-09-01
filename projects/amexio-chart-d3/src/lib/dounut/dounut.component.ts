import { Component, Input,OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector : 'amexio-d3-chart-donut',
    templateUrl:'./dounut.component.html'
})
export class AmexioD3DounutChartComponent
{
  predefinedcolors: string[];
  colorIndex: number = 0;
  labelstack = [];
  legendArray = [];
  colorforhtml = [];

    constructor() {
      this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    }
 
    @Input('data') dataset: any;
 

    /*
  Properties
  name : legend
  datatype : boolean
  version : 5.2 onwards
  default : true
  description : set legend
  */
 @Input() legend: boolean = true ;

    @Input('color') colors: any;
    
    @Input('width') svgwidth: any;
 
    @Input('height') svgheight: any;
 
    @Input() title: any = "";
 componentId: any
   ngOnInit() {
    this.generateRandomText();
     this.componentId = 'donut'+ this.generateRandomText();
//this.componentId = "20";
    setTimeout(() => {
      this.plotChart();
    }, 0);
   }
                                                  
   plotChart(){
    let flag =3;
    let color;

  this.initializeData();
    const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
 if(this.dataset[0].color)
{
  flag = 1;
}
 else if(this.colors){
  flag = 2;
}
 else{
  flag = 3;
}

let  colorarray1 = [];

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
      colorarray1.push(this.predefinedcolors[i]);
    }
  });
  this.colorforhtml =[];
  colorarray1.forEach(element => {
    this.colorforhtml.push(element);
  });
  color = d3.scaleOrdinal(colorarray1);
  break;

  case 2:
  this.colorforhtml =[]
  this.colors.forEach(element => {
  this.colorforhtml.push(element);
  });
  color = d3.scaleOrdinal(this.colors);
  break;

  case 3:
  this.colorforhtml =[]
  this.predefinedcolors.forEach(element => {
  this.colorforhtml.push(element);
  });
  color = d3.scaleOrdinal(this.predefinedcolors);
  break;
}
 

//logic for legend

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
 
 for (let i = 0; i < this.labelstack.length; i++) {
   let obj = {};
   obj['label'] = this.labelstack[i];
   if (this.colorforhtml[i]) {
     obj['color'] = this.colorforhtml[i];
   }
   else
     obj['color'] = 'black';
   this.legendArray.push(obj);
 }


    let svgWidth;
 
    let svgHeight;
       
   if(this.svgwidth){
svgWidth = this.svgwidth;
   }
   else{
svgWidth = 300;
   }
 
   if(this.svgheight){
     svgHeight = this.svgheight;
   }
   else{
     svgHeight = 300;
   }

let left = 0; 
let top = 0;
 
   let VALUES = [];
   let LABELS = this.dataset.label;
   let legendcolors = color;

   this.dataset.forEach(element => {
     if (element.label) {
       VALUES.push(element.label);
     }
   });                   
  







   
     let outerRadius=svgWidth/2;

    let innerRadius=svgWidth/4;

    let svg = d3.select('#'+this.componentId).append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
  .append('g')
     .attr(
         'transform','translate('+ svgWidth/2 +','+  svgHeight/2 +')'
     );

     let pie=d3.pie()
     .value(function(d){return d.value})
     .sort(null);
 
     let arc=d3.arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);
//set path(coordinates) for pie
     let path=svg.selectAll('path')
     .data(pie(this.dataset))
     .enter()
     .append('path')
     .attr('d', arc)
     .attr('fill', function(d,i){
       return color(d.data.label);
   }).on('mouseover', function (d) {
    tooltip.transition().duration(100).style('opacity', 1);
    tooltip.html(`Value: <span>${d.value}</span>`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px")
})
.on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));;
 
//print text on donut
let text=svg.selectAll('text')
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
         })
        .style('font-weight', 'bold')
        .style( 'font-size','12px');
   }


generateRandomText(){
   let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcddefghijklmonpqrstuvwxyz";
  for(let i = 0; i<5; i++){
    text = text + possible.charAt(Math.floor(Math.random()*possible.length));
  }
  console.log(" text ", text)
  return text;
}

   getColors(object: any) {
    if (object.color) {
      this.colorforhtml.push(object.color);
       return object.color;
    }
    else if (this.colors.length > this.colorIndex) {
      const color = this.colors[this.colorIndex];
      this.colorIndex++;
      this.colorforhtml.push(object.color);
       return color;
    }
    else if ((this.colors.length > 0) && (this.colors.length <= this.colorIndex)) {
      this.colorIndex = 0;
      const color = this.colors[this.colorIndex];
      this.colorIndex++;
      this.colorforhtml.push(object.color);
       return color;
    }
    else {
      const color = this.predefinedcolors[this.colorIndex];
      this.colorIndex++;
      this.colorforhtml.push(object.color);
       return color;
    }
  }

  initializeData() {
    this.dataset.forEach(element => {
      element.color = this.getColors(element);
      console.log("element.color", element.color);
    });
  }


}