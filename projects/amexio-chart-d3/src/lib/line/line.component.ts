import { Component, Input } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";

@Component({
    selector : 'amexio-d3-chart-line',
    templateUrl : "./line.component.html"
})
export class AmexioD3LineComponent extends AmexioD3BaseChartComponent implements PlotCart{

    @Input('horizontal-scale') hScale : boolean = true;

    @Input('vertical-scale')   vScale : boolean = false;
    
    constructor(){
        super('line');
    }

    ngOnInit(){
        this.initializeData();
        
        this.data.forEach(element => {
            element.label = element.label;
            element.value = +element.value;
        });

        setTimeout(()=>{
          this.plotD3Chart();
        },0);
    }

    plotD3Chart(){
        const tooltip = this.toolTip(d3);

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
        
        const line = d3.line()
                        .x(function(d) { return x(d.label); })
                        .y(function(d) { return y(d.value); });        

        x.domain(this.data.map( (d) => { return d.label }));
        y.domain([0, d3.max(this.data,  (d) => { return d.value; })]);
        

        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("color", "grey")
            .call(d3.axisBottom(x));
    

        g.append("g")
            .attr("color", "grey")
            .call(d3.axisLeft(y));
    
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

        g.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.selectAll('dot')
                .data(this.data)
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