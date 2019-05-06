import { Component, ViewChild, ElementRef, Input, ChangeDetectorRef, OnChanges } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseLineComponent } from "./baseline.component";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommanDataService } from '../services/comman.data.service';
import { DeviceQueryService } from "../services/device.query.service";

@Component({
    selector: 'amexio-d3-chart-line',
    templateUrl: "./line.component.html"
})
export class AmexioD3LineComponent extends AmexioD3BaseLineComponent implements PlotCart, OnChanges {
    @Input('label-color') labelcolor = '';
    @ViewChild('chartId') chartId: ElementRef;
    @ViewChild('divid') divid: ElementRef;
    @ViewChild('drillid') drillid: any;
    wt: number;
    constructor(public deviceQueryService: DeviceQueryService, private cdf: ChangeDetectorRef, public myservice: CommanDataService) {
        super(deviceQueryService);
    }

    ngOnInit() {
        this.wt = this.svgwidth;
        if (this.level <= 1) {
            let resp: any
            if (this.httpmethod && this.httpurl) {
                this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
                    resp = response;
                }, (error) => {
                }, () => {
                    setTimeout(() => {
                        this.data = this.getResponseData(resp);
                        this.plotD3Chart();
                    }, 0);
                });
            } else
                if (this.data) {
                    setTimeout(() => {
                        this.data = this.getResponseData(this.data);
                        this.plotD3Chart();
                    }, 0);
                }
        }
    }

    ngOnChanges() {
        if (this.data) {
            setTimeout(() => {
                this.data = this.getResponseData(this.data);
                this.plotD3Chart();
            }, 0);
        }
    }

    fetchData(data: any) {

        let requestJson;
        let key = this.drillabledatakey;
        let resp: any;
        if (this.drillabledatakey.length) {
            let drillabledata = this.getMultipleDrillbleKeyData(data, key);
            requestJson = drillabledata;
        }
        else {
            requestJson = data;
        }

        if (this.httpmethod && this.httpurl) {
            this.myservice.postfetchData(this.httpurl, this.httpmethod, requestJson).subscribe((response) => {
                resp = response;
            }, (error) => {
            }, () => {
                setTimeout(() => {
                    this.data = this.getResponseData(resp);
                    this.drawChart();
                }, 0);
            });
        }
    }

    drawChart() {
        setTimeout(() => {
            this.plotD3Chart();
        }, 0);
    }

    //RESIZE STEP 5 STARTS
    resize() {
        this.svg.selectAll("*").remove();
        this.resizeflag = true;
        if (this.wt) {
            this.svgwidth = this.wt;
        } else if (this.chartId) {
            // this.resizewt = this.chartId.nativeElement.offsetWidth;
            // console.log("", new Date().getTime(), " ", this.resizewt);
            this.svgwidth = this.chartId.nativeElement.offsetWidth;
        }
        this.cdf.detectChanges();
        this.plotD3Chart();
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

    plotD3Chart(): void {
        if (this.resizeflag == false) {
            //RESIZE STEP 1
            if (this.wt) {
                this.svgwidth = this.wt;

            } else if (this.chartId) {
                this.svgwidth = this.chartId.nativeElement.offsetWidth;
            }
            //RESIZE STEP 1 ENDS HERE 
        }
        const tooltip = this.toolTip(d3);

        const linechart = this.initChart();
        // this.svgwidth = linechart.width;
        this.plotScale(linechart.g, linechart.x, linechart.y, linechart.height, linechart.width);

        this.plotLine(linechart.g, linechart.x, linechart.y, linechart.height,
            linechart.width, [], tooltip, (1));

        for (let index = 0; index < this.multiseriesdata.length; index++) {
            this.plotLine(linechart.g, linechart.x, linechart.y, linechart.height,
                linechart.width, this.multiseriesdata[index], tooltip, (index + 1));
        }


    }


    //RESIZE STEP 4 STARTS
    validateresize() {
        setTimeout(() => {
            if (this.wt) {

            } else {
                this.resize();
            }
        }, 0)
    }
    //RESIZE STEP 4 ENDS

    private plotLine(g: any, x: any, y: any, height: any, width: any, data: any, tooltip: any, i: number): void {

        const line = d3.line()
            .x((d) => { return x(d.label); })
            .y((d) => { return y(d.value); });
        const tempcolor = "black";
        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", (d) => {
                if (this.linecolor.length > 0) {
                    if (this.linecolor[i - 1]) {
                        return this.linecolor[i - 1];
                    }
                    else {
                        return this.predefinedcolors[i - 1];
                    }
                }
                else if (this.linecolor.length < 1) {
                    return this.predefinedcolors[i - 1];
                    //  return tempcolor;

                }
            })
            .attr("stroke-width", 1.5)
            .attr("d", line)
            // .attr("transform", "translate(" + 37 + "," + 0 + ")")
            ;

        g.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", (d) => { return x(d.label); })
            .attr("cy", (d) => { return y(d.value); })
            .attr('r', 2)
            .attr("fill", (d) => {
                if (this.linecolor.length > 0) {
                    if (this.linecolor[i - 1]) {
                        return this.linecolor[i - 1];
                    }
                    else {
                        return this.predefinedcolors[i - 1];
                    }
                }
                else if (this.linecolor.length < 1) {
                    //  return tempcolor;
                    return this.predefinedcolors[i - 1];
                }
            })
            .attr("cursor", "pointer")
            // .attr("transform", "translate(" + 37 + "," + 0 + ")")
            .on("mouseover", (d) => {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", (d) => {
                return tooltip.html(
                    this.callTooltip(d))
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", (d) => {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", (d) => {
                this.lineChartClick(d);
                this.fordrillableClick(this, d, event);
                return tooltip.style("visibility", "hidden");
            });

        //lets plot labels here
        if (this.labelflag) {
            g.selectAll('label')
                .data(data)
                .enter()
                .append('text')
                .style("font-weight", "bold")
                .attr("text-anchor", "middle")
                .attr("fill", (d) => {
                    // if (this.labelcolor && this.labelcolor.length > 0) {
                    //   return this.labelcolor;
                    // } else {
                    //   return "black";
                    // }
                    if (this.labelcolor.length > 0) {
                        return this.labelcolor;
                    }
                    else if (this.linecolor.length > 0) {
                        if (this.linecolor[i - 1]) {
                            return this.linecolor[i - 1];
                        }
                        else {
                            return this.predefinedcolors[i - 1];
                        }
                    }
                    else if (this.linecolor.length < 1) {
                        //  return tempcolor;
                        return this.predefinedcolors[i - 1];
                    }
                })
                .attr("x", (d, i) => {
                    return x(d.label);
                })
                .attr("y", (d, i) => {
                    return y(d.value) - 10;
                })
                .text((d) => {
                    return d.value;
                })
                //   .attr("transform", "translate(" + 37 + "," + 0 + ")")
                .attr("cursor", "pointer")
                .on("mouseover", (d) => {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", (d) => {
                    return tooltip.html(
                        this.callTooltip(d))
                        .style("top", (d3.event.pageY - 10) + "px")
                        .style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", (d) => {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", (d) => {
                    this.lineChartClick(d);
                    this.fordrillableClick(this, d, event);
                    return tooltip.style("visibility", "hidden");
                });
        }

    }

    lineChartClick(d: any) {
        let obj = {};
        obj[d.legend] = d.value;
        obj[this.xaxisname] = d.label;
        this.chartClick(obj);
    }

    callTooltip(tooltipdata: any) {
        let obj = {};
        obj[tooltipdata.legend] = tooltipdata.value;
        obj[this.xaxisname] = tooltipdata.label;
        return this.toolTipForBar(obj);
    }
}