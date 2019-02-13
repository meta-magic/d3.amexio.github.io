import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import { DeviceQueryService } from '../services/device.query.service';

import * as d3 from 'd3';


@Component({
    selector: 'amexio-d3-chart-bar',
    templateUrl: './bar.component.html'
})
export class AmexioD3BarChartComponent extends AmexioD3BaseChartComponent implements PlotCart {
    @Input('width') svgwidth: number;
    @Input('height') svgheight: number = 300;
    @Input() horizontal: boolean = false;
    @Input('label-color') labelcolor: string = "black";
    @Input('label') labelflag: boolean = false;
    @ViewChild('chartId') chartId: ElementRef;
    @ViewChild('divid') divid: ElementRef;
    @ViewChild('drillid') drillid: any;
    @Input('data-reader') datareader: string;
    @Input('level') level: number = 0;
    @Input('target') target: number;
    @Input('drillable-data') drillabledatakey: any[] = [];
    @Input('horizontal-scale') hScale: boolean = true;
    @Input('yaxis-interval') tickscount: number;

    resizeflag: boolean = false;
    checkmob: boolean;
    resizeg: any;
    drillableFlag: boolean = true;
    data: any;
    xaxis: any;
    yaxis: any;
    svg: any;
    colorflag: boolean = false;
    keyArray: any[] = [];
    transformeddata: any[] = [];
    object: any;
    legendArray: any[] = [];
    constructor(private myservice: CommanDataService, private cdf: ChangeDetectorRef, private device: DeviceQueryService) {

        super('bar');


    }
    ngOnInit() {


        if (this.level <= 1) {
            let resp: any;
            if (this.httpmethod && this.httpurl) {
                this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
                    resp = response;
                }, (error) => {
                }, () => {
                    setTimeout(() => {
                        this.data = this.getResponseData(resp);
                        this.drawChart();

                    }, 0);
                });

            } else if (this.data) {

                setTimeout(() => {
                    this.data = this.getResponseData(this.data);

                    this.transformData(this.data)
                    this.initializeData();
                    this.plotD3Chart();

                }, 0);

            }
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

            this.initializeData();
            this.plotD3Chart();
        }, 0);

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

    plotD3Chart(): any {

        this.formLegendData();
        if (this.resizeflag == false) {
            if (this.chartId) {

                this.svgwidth = this.chartId.nativeElement.offsetWidth;

            } else {

                this.svgwidth = this.svgwidth;
            }
        }



        const tooltip = this.toolTip(d3);
        this.svg = d3.select("#" + this.componentId);
        const margin = { top: 20, right: 60, bottom: 30, left: 60 };

        const width = this.svgwidth - margin.left - margin.right;
        const height = this.svgheight - margin.top - margin.bottom;

        //const height = +svg.attr("height") - margin.top - margin.bottom;

        let x, y;
        const g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (this.horizontal == false) {
            x = d3.scaleBand()
                .rangeRound([0, width])
                .padding(0.1);
            y = d3.scaleLinear()
                .rangeRound([height, 0]);

            //setting content for x and y axis
            x.domain(this.data.map((d) => {

                return d[Object.keys(d)[0]];
                //    return d.label
            }));
            y.domain([0, d3.max(this.data, (d) => {
                return d[Object.keys(d)[1]];
                //return d.value;
            })]);


            // add x axis to svg
            if (this.device.IsDesktop() == true) {
                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
            }
            else {
                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x)).
                    selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(60)")
                    .style("text-anchor", "start");

            }

            //add y axis to svg
            g.append("g")
                .call(d3.axisLeft(y)
                    .ticks(this.tickscount))

            this.plotLine(g, x, y, height, width);

            //add bar chart
            g.selectAll(".bar")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d) => {
                    return x(d[Object.keys(d)[0]]);
                    // return x(d.label); 
                })
                .attr("y", (d) => {
                    return y(d[Object.keys(d)[1]]);
                    // return y(d.value); 
                })
                .attr("cursor", "pointer")
                .attr("width", x.bandwidth())
                .attr("height", (d) => { return height - y(d[Object.keys(d)[1]]); })

                .style("fill", (d) => {
                    // return "blue";
                    return d.color;
                })
                .on("mouseover", (d) => {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", (d) => {
                    return tooltip.html(
                        this.formTooltipData(d)
                        //  this.toolTipForBar(d)
                        // this.toolTipContent(d)
                    )
                        .style("top", (d3.event.pageY - 10) + "px")
                        .style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", (d) => {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", (d) => {
                    this.barChartClick(d);
                    this.fordrillableClick(this, d, event);
                    return tooltip.style("visibility", "hidden");
                    //this.chartClick(d);
                });

            if (this.labelflag) {
                var yTextPadding = 40;
                this.svg.selectAll(".label")
                    .data(this.data)
                    .enter()
                    .append("text")
                    .style("font-weight", "bold")
                    .style("font-size", "1vw")
                    .attr("text-anchor", "middle")
                    .attr("fill", (d) => {
                        if (this.labelcolor.length > 0) {
                            return this.labelcolor;
                        } else {
                            return "black";
                        }
                    })
                    .attr("x", (d, i) => {
                        return x(d[Object.keys(d)[0]]) + margin.left + x.bandwidth() / 2;
                    })
                    .attr("y", (d, i) => {
                        return y(d[Object.keys(d)[1]]) + yTextPadding;
                    })
                    .text((d) => {
                        return d[Object.keys(d)[1]];
                    })
                    .attr("cursor", "pointer")
                    .on("mouseover", (d) => {
                        return tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", (d) => {
                        return tooltip.html(
                            this.formTooltipData(d)
                            //  this.toolTipForBar(d)
                            // this.toolTipContent(d)
                        )
                            .style("top", (d3.event.pageY - 10) + "px")
                            .style("left", (d3.event.pageX + 10) + "px");
                    })
                    .on("mouseout", (d) => {
                        return tooltip.style("visibility", "hidden");
                    })
                    .on("click", (d) => {
                        this.barChartClick(d);
                        this.fordrillableClick(this, d, event);
                        return tooltip.style("visibility", "hidden");
                        //this.chartClick(d);
                    });
            }//if ends fr 
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
                    return parseInt(
                        d[Object.keys(d)[1]]
                        // d.value
                    );
                })]);
            // d[Object.keys(d)[1]]

            y.domain(this.data.map((d) => {
                return d[Object.keys(d)[0]]
                //return d.label;
            }))

            // add x axis to svg
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(10));

            //add y axis to svg
            g.append("g")
                .call(d3.axisLeft(y).ticks(this.tickscount))

            this.plotLine(g, x, y, height, width);
            //add bar chart
            g.selectAll(".bar")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", (d) => {
                    return y(
                        d[Object.keys(d)[0]]
                        // d.label
                    );
                })
                .attr("cursor", "pointer")
                .attr("width", (d) => {
                    return x(
                        d[Object.keys(d)[1]]
                        // d.value
                    )
                })
                .attr("height", y.bandwidth())
                .style("fill", (d) => { return d.color; })
                .on("mouseover", (d) => {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", (d) => {
                    return tooltip.html(
                        this.formTooltipData(d)
                        // this.formLegendData(d)
                        // this.toolTipContent(d)
                    )
                        .style("top", (d3.event.pageY - 10) + "px")
                        .style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", (d) => {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", (d) => {
                    this.barChartClick(d);
                    this.fordrillableClick(this, d, event);
                    return tooltip.style("visibility", "hidden");
                    //this.chartClick(d);
                });

            if (this.labelflag) {
                let yTextPadding = 40;
                this.svg.selectAll(".label")
                    .data(this.data)
                    .enter()
                    .append("text")
                    .style("font-weight", "bold")
                    .attr("text-anchor", "middle")
                    .attr("vertical-align", "middle")
                    .attr("margin-top", margin.top)
                    .attr("fill", (d) => {
                        if (this.labelcolor.length > 0) {
                            return this.labelcolor;
                        } else {
                            return "black";
                        }
                    })
                    .attr("x", (d, i) => {
                        return x(d[Object.keys(d)[1]]) + yTextPadding;
                    })
                    .attr("y", (d, i) => {
                        return y(d[Object.keys(d)[0]])
                            + margin.top + y.bandwidth() / 2;
                    })
                    .text((d) => {
                        return d[Object.keys(d)[1]];
                    })
                    .attr("cursor", "pointer")
                    .on("mouseover", (d) => {
                        return tooltip.style("visibility", "visible");
                    })
                    .on("mousemove", (d) => {
                        return tooltip.html(
                            this.formTooltipData(d)
                            // this.formLegendData(d)
                            // this.toolTipContent(d)
                        )
                            .style("top", (d3.event.pageY - 10) + "px")
                            .style("left", (d3.event.pageX + 10) + "px");
                    })
                    .on("mouseout", (d) => {
                        return tooltip.style("visibility", "hidden");
                    })
                    .on("click", (d) => {
                        this.barChartClick(d);
                        this.fordrillableClick(this, d, event);
                        return tooltip.style("visibility", "hidden");
                        //this.chartClick(d);
                    });
            }

        }//else ends(horizontal bar logic ends)

    }

    plotLine(g, x, y, height, width) {

        if (this.hScale) {
            g.append('g')
                .attr("color", "lightgrey")
                .call(d3.axisLeft(y).ticks(this.tickscount)
                    .tickSize(-width).tickFormat(''));
        }
    }


    formTooltipData(tooltipData: any) {
        let object = {};
        for (let [key, value] of Object.entries(tooltipData)) {
            if (key != 'color') {
                object[key] = value;
            }
        }
        return this.toolTipForBar(object);
    }

    transformData(data: any) {

        this.keyArray = data[0];
        data.forEach((element, index) => {
            if (index > 0) {
                let DummyObject = {};
                element.forEach((individualvalue, keyindex) => {
                    DummyObject[this.keyArray[keyindex]] = individualvalue;
                });//inner for loop ends
                this.transformeddata.push(DummyObject);
            }//if ends
        });//outer for loop ends
        this.data = this.transformeddata;
    }

    formLegendData() {
        this.legendArray = [];
        this.data.forEach(element => {
            let legendobject = {};
            legendobject['label'] = element[Object.keys(element)[0]];
            legendobject['value'] = element[Object.keys(element)[1]];
            legendobject['color'] = element.color;
            this.legendArray.push(legendobject);
        });
    }

    onBarLegendClick(legendevent: any) {
        let obj = {};
        //  obj['label'] = legendevent.label;
        //  obj['value'] = legendevent.value;
        obj[this.keyArray[0]] = legendevent.label;
        obj[this.keyArray[1]] = legendevent.value;
        //obj[legendevent.label] = legendevent.value;
        //delete event.color;
        this.legendClick(obj);
    }

    barChartClick(event: any) {
        let object = {};
        for (let [key, value] of Object.entries(event)) {
            if (key != 'color') {
                object[key] = value;
            }
        }
        this.chartClick(object);
    }

    resize(data: any) {

        this.svg.selectAll("*").remove();

        this.resizeflag = true;
        this.svgwidth = this.divid.nativeElement.offsetWidth;

        this.cdf.detectChanges();
        this.plotD3Chart();

    }

}