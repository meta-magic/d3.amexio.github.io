import { Component, Input, ViewChild, ElementRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import * as d3 from 'd3';

@Component({
    selector: 'amexio-d3-chart-bar',
    templateUrl: './bar.component.html'
})
export class AmexioD3BarChartComponent extends AmexioD3BaseChartComponent implements PlotCart {
    @Input('width') svgwidth: number = 300;
    @Input('height') svgheight: number = 300;
    @ViewChild('chartId') chartId: ElementRef;

    constructor() {
        super('bar');
    }

    ngOnInit() {
        this.initializeData();
        setTimeout(() => {
            this.plotD3Chart();
        }, 0);
    }

    plotD3Chart() {

        this.svgwidth = this.chartId.nativeElement.offsetWidth;


        const tooltip = this.toolTip(d3);

        const svg = d3.select("#" + this.componentId);

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = this.svgwidth - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1);
        const y = d3.scaleLinear()
            .rangeRound([height, 0]);

        const g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //setting content for x and y axis
        x.domain(this.data.map((d) => { return d.label }));
        y.domain([0, d3.max(this.data, (d) => { return d.value; })]);

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
            .attr("x", (d) => { return x(d.label); })
            .attr("y", (d) => { return y(d.value); })
            .attr("cursor", "pointer")
            .attr("width", x.bandwidth())
            .attr("height", (d) => { return height - y(d.value); })
            .style("fill", (d) => { return d.color; })
            .on("mouseover", (d) => {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", (d) => {
                return tooltip.html(this.toolTipContent(d))
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", (d) => {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", (d) => {
                this.chartClick(d);
            });

    }

    resize() {

    }

}