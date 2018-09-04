import { Component } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import * as d3 from 'd3';

@Component({
    selector : 'amexio-d3-chart-bar',
    templateUrl :'./bar.component.html'
})
export class AmexioD3BarChartComponent extends AmexioD3BaseChartComponent implements PlotCart
{
    tooltipdata : any;
    showtooltip : boolean = false;
    tooltipx : string;
    tooltipy : string;

    constructor(){
        super('bar');
    }

    ngOnInit(){
        this.initializeData();
        setTimeout(()=>{
          this.plotD3Chart();
        },0);
    }
    
    plotD3Chart(){
        const svg = d3.select("#"+this.componentId);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
  
        const x = d3.scaleBand()
                    .rangeRound([0, width])
                    .padding(0.1);
        const y = d3.scaleLinear()
                    .rangeRound([height, 0]);

        const g = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //setting content for x and y axis
        x.domain(this.data.map( (d) => { return d.label }));
        y.domain([0, d3.max(this.data,  (d) => { return d.value; })]);

        // add x axis to svg
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        //add y axis to svg
        g.append("g")
            .call(d3.axisLeft(y)
            .ticks(10))
        
         //add bar chart
        g.selectAll(".bar")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x",  (d) => { return x(d.label); })
            .attr("y", (d) =>  { return y(d.value); })
            .attr("width", x.bandwidth())
            .attr("height", (d) =>  { return height - y(d.value); })
            .style("fill", (d) =>  { return d.color;})
            .on('mouseover',(data) => {
                debugger;
                this.showToolTip(data, d3.event.pageX, d3.event.pageY);
            })
            .on('mouseout',(data) =>{
                this.hideToolTip();
            }); 

    }

    showToolTip(node:any, x:any, y:any){
        debugger;
        this.showtooltip = true;
        this.tooltipx = x+"px";
        this.tooltipy = y+"px";
        const ttdata = node;
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