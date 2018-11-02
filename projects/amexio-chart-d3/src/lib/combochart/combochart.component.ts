import { Component, Input, ViewChild, ElementRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import * as d3 from 'd3';
import { stringify } from "@angular/core/src/render3/util";
@Component({
    selector: 'amexio-d3-combochart',
    templateUrl: './combochart.component.html',
    styleUrls: ['./combochart.component.css']
})
export class CombochartComponent extends AmexioD3BaseChartComponent implements PlotCart {
    @Input('width') svgwidth: number = 300;
    @Input('height') svgheight: number = 300;
    @Input('line-color') lineColor: string = "black";
    @Input() horizontal: boolean = false;
    @ViewChild('chartId') chartId: ElementRef;
    @Input('data-reader') datareader: string;
    @Input('level') level: number = 0;
    @Input('target') target: number;
    @Input('drillable-data') drillabledatakey: any[] = []
    @Input('line-data-index') lineInput: any;
    @Input('horizontal-scale') hScale : boolean = true;
    drillableFlag: boolean = true;
    data: any;

    colorflag: boolean = false;
    keyArray: any[] = [];
    transformeddata: any[] = [];
    object: any;
    legendArray: any[] = [];
    httpresponse:any;
    constructor(private myservice: CommanDataService) {
        super('combochart');
    }
    ngOnInit() {
        if (this.level <= 1) {
            let resp: any;
            if (this.httpmethod && this.httpurl) {
                this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
                    resp = response;
                    this.httpresponse=response;
                }, (error) => {
                }, () => {
                    setTimeout(() => {
                        this.data = this.getResponseData(resp);
                        this.transformData(this.data)
                        this.initializeData();
                        this.plotD3Chart();
                    
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
                this.httpresponse=response;
            }, (error) => {
            }, () => {
                setTimeout(() => {
                   // this.data = this.getResponseData(resp);
                    this.drawChart();
                }, 0);
            });
        }
    }

    drawChart() {
        setTimeout(() => { 
            this.data = this.getResponseData(this.httpresponse);
            this.transformData(this.data)
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

    plotD3Chart() {

        this.formLegendData();
        if (this.chartId) {
            this.svgwidth = this.chartId.nativeElement.offsetWidth;
        } else {

            this.svgwidth = this.svgwidth;
        }
        let lineName: any = this.lineInput;

        const tooltip = this.toolTip(d3);
        const svg = d3.select("#" + this.componentId);
        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const width = this.svgwidth - margin.left - margin.right;
        const height = this.svgheight - margin.top - margin.bottom;
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
            x.domain(this.data.map((d) => {
                return d[Object.keys(d)[0]];
            }));
            let barRange = d3.max(this.data, (d) => {
                return d[Object.keys(d)[1]];
            });

            let lineRange = d3.max(this.data, (d) => {
                return d[this.lineInput];
            })
            let range;
            if (barRange > lineRange) {
                range = barRange;
            }
            else {
                range = lineRange;
            }
            y.domain([0, range]);

            // add x axis to svg
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));
            //add y axis to svg
            g.append("g")
                .call(d3.axisLeft(y)
                    .ticks(10))

           this.plotLine(g,x,y,height,width); 
           
            //add bar chart
            g.selectAll(".bar")
                .data(this.data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d) => {
                    return x(d[Object.keys(d)[0]]);
                })
                .attr("y", (d) => {
                    return y(d[Object.keys(d)[1]]);
                })
                .attr("cursor", "pointer")
                .attr("width", x.bandwidth())
                .attr("height", (d) => { return height - y(d[Object.keys(d)[1]]); })
                .style("fill", (d) => {
                    return d.color;
                })
                .on("mouseover", (d) => {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", (d) => {
                    return tooltip.html(
                        this.formTooltipData(d))
                        .style("top", (d3.event.pageY - 10) + "px")
                        .style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", (d) => {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", (d) => {

                    this.barChartClick(d);
                    this.fordrillableClick(this, d,event);
                    return tooltip.style("visibility", "hidden");
                });
            //line code start
            let valueline = d3.line()
                .x(function (d) {
                    return x(
                        d[Object.keys(d)[0]]
                    );
                })
                .y(function (d) {
                    return y(
                        d[lineName]
                    );
                });

            let shift = margin.left + x.bandwidth() / 2;
            svg.append("path")
                .data([this.data])
                .attr("fill", "none")
                .style("stroke", this.lineColor)
                .attr("stroke-width", 1.5)
                .attr("transform", "translate( " + shift + ", 20 )")
                .attr("d", valueline);
            let points1 = svg.selectAll("circle.point1")
                .data(this.data)

            points1.enter().append("circle")
                .merge(points1)
                .attr("class", "point1")
                .attr("cursor", "pointer")
                .style("stroke", this.lineColor)
                .style("fill", this.lineColor)
                .attr("cx", (d) => {
                    return x(
                        d[Object.keys(d)[0]]
                    );
                })
                .attr("cy", (d) => {
                    return y(
                        d[lineName]
                    );
                })
                .attr("r", (d) => { return 5; })
                .attr("transform", "translate( " + shift + ", 20 )")
                .on("mouseover", (d) => {
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", (d) => {
                    return tooltip.html(
                        this.formTooltipLineData(d))
                        .style("top", (d3.event.pageY - 10) + "px")
                        .style("left", (d3.event.pageX + 10) + "px");
                })
                .on("mouseout", (d) => {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", (d) => {
                    this.onComboLineClick(d);
                    this.fordrillableClick(this, d,event);
                    return tooltip.style("visibility", "hidden");
                });
            //line code ends
        }


    }

    plotLine(g,x,y,height,width)
{

    if(this.hScale){
        g.append('g')
            .attr("color", "lightgrey")
            .call(d3.axisLeft(y)
            . tickSize(-width).tickFormat(''));     
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
        this.transformeddata=[];
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
        obj[this.keyArray[0]] = legendevent.label;
        obj[this.keyArray[1]] = legendevent.value;
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

    onComboLineClick(data: any) {
        let object = {};
        for (let [key, value] of Object.entries(data)) {
            if (key != "color") {
                object[key] = value;
            }
        }
        this.comboLineClick(object);
        //this.chartClick(object);
    }

    formTooltipLineData(data: any) {
        let object = {};
        for (let [key, value] of Object.entries(data)) {
            if (key == this.lineInput) {
                object[key] = value;
            }
        }
        return this.toolTipForBar(object);
    }

    resize() {

    }


}
