import { AmexioD3BaseChartComponent } from "projects/amexio-chart-d3/src/lib/base/base.component";
import { Input } from "@angular/core";
import * as d3 from 'd3';

export class AmexioD3BaseLineComponent extends AmexioD3BaseChartComponent
{
    @Input('horizontal-scale') hScale : boolean = true;

    @Input('vertical-scale')   vScale : boolean = false;


    protected initChart() : any {

        const svg       = d3.select("#"+this.componentId);
        const margin    = { top: 20, right: 20, bottom: 30, left: 40 };
        const width     = +svg.attr("width") - margin.left - margin.right;
        const height    = +svg.attr("height") - margin.top - margin.bottom;
        const g         = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand()
                    .rangeRound([0, width])
                    .padding(0.1);                    
    
        const y = d3.scaleLinear()
                     .rangeRound([height, 0]);

        x.domain(this.data.map( (d) => { return d.label }));
        y.domain([0, d3.max(this.data,  (d) => { return d.value; })]);
             
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("color", "grey")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("color", "grey")
            .call(d3.axisLeft(y));


        return{
            g, x, y, height, width
        }

    }

    protected plotScale(g:any,x:any, y:any,height:any,width:any) : void 
    {
        if(this.vScale){
            g.append('g')
                .attr("color", "lightgrey")
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x).tickSize(-this.width).tickFormat(''));
        }
        if(this.hScale){
            g.append('g')
                .attr("color", "lightgrey")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));     
        }
    }

    protected plotLine(g:any,x:any, y:any,height:any,width:any, data:any, tooltip :any, i:number) : void
    {
        const line = d3.line()
                        .x(function(d) { return x(d.label); })
                        .y(function(d) { return y(d.value); });        
    
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", this.predefinedcolors[i])
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.selectAll('dot')
                .data(data)
                .enter()
                .append('circle')
                .attr("cx",  (d) => { return x(d.label); })
                .attr("cy", (d) =>  { return y(d.value); })
                .attr('r', 2)
                .on("mouseover", (d) => {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", (d) => {
                        return tooltip.html(this.toolTipContent(d))
                                            .style("top", (d3.event.pageY-10)+"px")
                                            .style("left",(d3.event.pageX+10)+"px");
                })
                .on("mouseout", (d) => {
                        return tooltip.style("visibility", "hidden");
                })
                .on("click", (d) => {
                     this.chartClick(d);
                });
    }    
}