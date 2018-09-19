import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { PlotCart } from '../base/chart.component';

@Component({
    selector : 'amexio-d3-chart-donut',
    templateUrl:'./dounut.component.html'
})
export class AmexioD3DounutChartComponent extends AmexioD3BaseChartComponent implements PlotCart
{

    @Input('pie') pie : boolean = false;
    @Input('width') svgwidth: number = 300;
    @Input('height') svgheight: number = 300;
    @ViewChild('chartId') chartId: ElementRef;

    constructor() 
    {
      super('DONUTCHART');
    }

    ngOnInit(){
      this.initializeData();
      setTimeout(()=>{
        this.plotD3Chart();
      },0);
    }

    plotD3Chart(){
      const outerRadius = this.svgwidth/2;
      let innerRadius = this.svgwidth/4;
      
      if(this.pie){
        innerRadius = 0;
      }

      const tooltip = this.toolTip(d3);
                  
      const arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius);

      const pie = d3.pie()
                      .value( (d)=>{return d.value});

      const svg = d3.select("#"+this.componentId)
                  .append('g')
                  .attr('transform','translate('+ this.svgwidth/2 +','+  this.svgheight/2 +')')
                  .selectAll('path')
                  .data(pie(this.data))
                  .enter();

      const path = svg.append('path')
                      .attr('d', arc)
                      .attr('fill', function(d,i) {
                        return (d && d.data && d.data.color) ? d.data.color : "black"
                      })
                      .attr('cursor', 'pointer')
                      .on("mouseover", (d) => {
                                return tooltip.style("visibility", "visible");
                      })
                      .on("mousemove", (d) => {
                                return tooltip.html(this.toolTipContent(d.data))
                                              .style("top", (d3.event.pageY-10)+"px")
                                              .style("left",(d3.event.pageX+10)+"px");
                      })
                      .on("mouseout", (d) => {
                                return tooltip.style("visibility", "hidden");
                      })
                      .on("click", (d) => {
                          this.chartClick(d.data);
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

    resize(){

    }
    

}
