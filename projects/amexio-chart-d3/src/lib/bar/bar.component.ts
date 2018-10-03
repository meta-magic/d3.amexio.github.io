import { Component, Input, ViewChild, ElementRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommanDataService } from '../services/comman.data.service';

import * as d3 from 'd3';

@Component({
    selector: 'amexio-d3-chart-bar',
    templateUrl: './bar.component.html'
})
export class AmexioD3BarChartComponent extends AmexioD3BaseChartComponent implements PlotCart {
    @Input('width') svgwidth: number = 300;
    @Input('height') svgheight: number = 300;
    @Input() horizontal: boolean = false;
    @ViewChild('chartId') chartId: ElementRef;
    @Input('data-reader') datareader: string;
    data: any;
    constructor(private myservice: CommanDataService) {
        super('bar');
    }
    ngOnInit() {
        let resp: any
        if (this.httpmethod && this.httpurl) {
            this.myservice.fetchData(this.httpurl, this.httpmethod).subscribe((response) => {
                resp = response;
            }, (error) => {
            }, () => {
                setTimeout(() => {
                    this.data = this.getResponseData(resp);
                    this.initializeData();
                    this.plotD3Chart();
                }, 0);
            });

        } else if (this.data) {

            setTimeout(() => {
                this.data = this.getResponseData(this.data);
                this.initializeData();
                this.plotD3Chart();
            }, 0);
        }
    }

    getResponseData(httpResponse: any) {
        let responsedata = httpResponse;
        if (this.datareader != null) {
            const dr = this.datareader.split('.');
            for (const ir of dr) {
                responsedata = responsedata[ir];
            }
        } else {
            responsedata = httpResponse;
        }
        return responsedata;
    }

    plotD3Chart() {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;
        const tooltip = this.toolTip(d3);
        const svg = d3.select("#" + this.componentId);
        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const width = this.svgwidth - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
        let x, y;
        const g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        if (this.horizontal == false) {
            x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1);
            y = d3.scaleLinear()
                .rangeRound([height, 0]);

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

        else if (this.horizontal == true) {

            x = d3.scaleLinear()
                .rangeRound([0, width])
                ;
            y = d3.scaleBand()
                .rangeRound([height, 0]).padding(0.1);

            //setting content for x and y axis
            x.domain([0, d3.max(this.data,
                (d) => {
                    return parseInt(d.value);
                })]);


            y.domain(this.data.map((d) => {
                //  return 100;
                return d.label;
            }))

            // add x axis to svg
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(10));
            //add y axis to svg
            g.append("g")
                .call(d3.axisLeft(y))

            //add bar chart
            g.selectAll(".bar")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", (d) => { return y(d.label); })
                .attr("cursor", "pointer")
                .attr("width", (d) => { return x(d.value) })
                .attr("height", y.bandwidth())
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

    }

    resize() {

    }

}