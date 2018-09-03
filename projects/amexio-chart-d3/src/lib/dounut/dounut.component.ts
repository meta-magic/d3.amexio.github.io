import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { PlotCart } from '../base/chart.component';

@Component({
    selector : 'amexio-d3-chart-donut',
    templateUrl:'./dounut.component.html'
})
export class AmexioD3DounutChartComponent extends AmexioD3BaseChartComponent 
                                           implements PlotCart
{

    tooltipdata : any;
    showtooltip : boolean = false;
    tooltipx : string;
    tooltipy : string;

    @Input('pie') pie : boolean = false;

    constructor() 
    {
      super('d-p');
    }

    ngOnInit(){
      this.initializeData();
      setTimeout(()=>{
        this.plotD3Chart();
      },0);
    }

    plotD3Chart(){
      const outerRadius = this.width/2;
      let innerRadius = this.width/4;
      
      if(this.pie){
        innerRadius = 0;
      }

      const arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);

      const pie = d3.pie()
                      .value(function(d){return d.value})

      const svg = d3.select("#"+this.componentId)
                  .append('g')
                  .attr('transform','translate('+ this.width/2 +','+  this.height/2 +')')
                  .selectAll('path')
                  .data(pie(this.data))
                  .enter();


      const path = svg.append('path')
                      .attr('d', arc)
                      .attr('fill', (d,i) => {
                        return (d && d.data && d.data.color) ? d.data.color : "black"
                      })
                      .on('mouseover',(data) =>{
                        this.showToolTip(data, d3.event.pageX, d3.event.pageY);
                      })
                      .on('mouseout',(data) =>{
                        this.hideToolTip();
                      });                   
                      
      const text = svg.append("text")
                      .transition()
                      .duration(200)
                      .attr("transform", function (d) {
                          return "translate(" + arc.centroid(d) + ")";
                      })
                      .attr("text-anchor", "middle")
                      .text(function(d){
                          return d.data.value;
                      })
                      .style('fill',function(d){
                        return (d && d.data && d.data.textcolor) ? d.data.textcolor : "black";
                      })
                      .style( 'font-size','12px');                      

    }

    showToolTip(node:any, x:any, y:any){
      this.showtooltip = true;
      this.tooltipx = x+"px";
      this.tooltipy = y+"px";
      const ttdata = node.data;
      this.tooltipdata = [];
      for (const key in ttdata) {
        if (ttdata.hasOwnProperty(key)) {
          const value = ttdata[key];
          this.tooltipdata.push({'text':key,'value':value});
        }
      }
     
    }
    
    hideToolTip(){
      this.showtooltip = false;
    }

    onClick(node:any){
      this.onLegendClick.emit(node);
    }

}
