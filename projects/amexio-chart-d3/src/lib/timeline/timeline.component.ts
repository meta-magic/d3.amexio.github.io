import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import * as d3 from 'd3';
import { CommanDataService } from '../services/comman.data.service';
import { DeviceQueryService } from '../services/device.query.service';


@Component({
    selector: 'amexio-d3-chart-timeline',
    templateUrl: './timeline.component.html'
})
export class AmexioD3TimelineChartComponent extends AmexioD3BaseChartComponent {

    @Input('data') data: any;
    @ViewChild('chartId') chartId: ElementRef;
    @ViewChild('divid') divid: ElementRef;
    @Input('width') svgwidth: number;
    @Input('height') svgheight: number = 200;
    @Input('data-reader') datareader: string;
    @Input('level') level: number = 0;
    @Input('target') target: number;
    @Input('drillable-data') drillabledatakey: any[] = [];
    @Input('label-color') labelcolor: string = "black";
    @Input('label') labelflag: boolean = false;
 
    lanes: any[] = [];
    timelinechartData: any[] = [];
    mindate: any;
    maxdate: any;
    legends: any;
    drillableFlag: boolean = true;
    resizeflag: boolean = false;
    svg: any;
    urldata: any;
    monthlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    wt: number;
    constructor(private myservice: CommanDataService, private cdf: ChangeDetectorRef, private device: DeviceQueryService) {
        super('timeline');
    }

    ngOnInit() {
        this.wt = this.svgwidth;
        if (this.level <= 1) {
            let resp: any;
            if (this.httpmethod && this.httpurl) {
                this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
                    resp = response;
                }, (error) => {
                }, () => {
                    setTimeout(() => {
                        this.data = this.getResponseData(resp);
                        this.transformTODate(this.data);
                        this.transformData(this.urldata);
                        this.plotChart();
                    }, 0);
                });

            } else if (this.data) {

                setTimeout(() => {
                    this.data = this.getResponseData(this.data);
                    this.transformData(this.data);
                    this.plotChart();
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
            this.transformTODate(this.data);
            this.transformData(this.urldata);
            this.plotChart();

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

    plotChart() {
        let laneLength = this.lanes.length;
        const tooltip = this.toolTip(d3);

        if (this.resizeflag == false) {
              //RESIZE STEP 1
      if (this.wt) {
        this.svgwidth = this.wt;

      } else if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;

      }
      //RESIZE STEP 1 ENDS HERE 
        }

        let m = [20, 25, 15, 120], //top right bottom left
            width = this.svgwidth - m[1] - m[3],
            height = this.svgheight - m[0] - m[2],
            miniHeight = laneLength * 12 + 50,
            mainHeight = height - miniHeight - 50;

        let mindate;
        let maxdate;
        let barheight = 20;
        if (this.httpurl && this.httpmethod) {

            mindate = this.urldata[0][1].getFullYear(),
                maxdate = this.urldata[this.urldata.length - 1][2].getFullYear();
        }
        else {
            mindate = this.data[0][1].getFullYear(),
                maxdate = this.data[this.data.length - 1][2].getFullYear();
        }


        let x = d3.scaleTime()
            .domain([this.mindate, this.maxdate])
            .range([0, width]);


        let x1 = d3.scaleLinear()
            .domain([mindate, maxdate])
            .range([m[3], width + m[3]]);

        let y1 = d3.scaleLinear()
            .domain([0, laneLength])
            .range([0, miniHeight]);


        this.svg = d3.select("#" + this.componentId)
        .attr('viewBox', '0 0 ' + this.svgwidth + ' ' + this.svgheight)
            .attr("width", width + m[1] + m[3])
            .attr("height", height + m[0] + m[2])


        if (this.device.IsDesktop() == true) {
            if (this.svgwidth <= 400) {
                this.svg.append("g")
                  .attr("transform", "translate(0," + height + ")")
                  .call(d3.axisBottom(x1)).
                  selectAll("text")
                  .attr("y", 0)
                  .attr("x", 9)
                  .attr("dy", ".35em")
                  .attr("transform", "rotate(60)")
                  .style("text-anchor", "start");
              }
              else {
                this.svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1));
              }
        }
        else {
            this.svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x1)).
                selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(60)")
                .style("text-anchor", "start");
        }

        let mini = this.svg.append("g")
            .attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
            .attr("width", width)
            .attr("height", mainHeight)
            .attr("class", "mini");

        //mini lanes and texts
        mini.append("g").selectAll(".laneLines")
            .data(this.timelinechartData)
            .enter().append("line")
            // .attr("x1", m[1])
            .attr("y1", (d) => { return y1(d.lane); })
            .attr("x2", width)
            .attr("y2", (d) => { return y1(d.lane); })
            .attr("stroke", "lightgray");


        mini.append("g").selectAll(".laneText")
            .data(this.lanes)
            .enter().append("text")
            .text((d) => { return d; })
            .attr("x", -m[1])
            .attr("y", (d, i) => { return y1(i + .5); })
            .attr("dy", ".5ex")
            .attr("text-anchor", "end")
            .attr("class", "laneText");

        //mini item rects
        mini.append("g").selectAll("miniItems")
            .data(this.timelinechartData)
            .enter().append("rect")
            .attr("class", (d) => { return "miniItem" + d.lane; })
            .attr("fill", (d, index) => { return this.predefinedcolors[index] })
            .attr("x", (d) => { return x(d.start); })
            .attr("y", (d) => { return (y1(d.lane + .5) - 5); })
            .attr("width", (d) => {
                return Math.abs(x(d.end) - x(d.start));
            })
            .attr("height", barheight)
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
                this.timelineChartClick(d)
                this.fordrillableClick(this, d, event);
                return tooltip.style("visibility", "hidden");
            });
        let barwidth;

        //mini labels
        let monthlist1 = this.monthlist;
        if (this.labelflag) {
            mini.append("g").selectAll(".miniLabels")
                .data(this.timelinechartData)
                .enter().append("text")
                .style("font-weight", "bold")
                .attr("fill", (d) => {
                    if (this.labelcolor.length > 0) {
                        return this.labelcolor;
                    } else {
                        return "black";
                    }
                })
                .style("font-size", (d) => {
                    barwidth = Math.min(Math.abs(x(d.end) - x(d.start)))
                    return barwidth / 20 + "px";
                })
                .text((d) => {
                    if (d.id) {
                        let startfullyear = d.start.getFullYear();
                        let startMonth = monthlist1[d.start.getMonth()];
                        let endfullyear = d.end.getFullYear();
                        let endMonth = monthlist1[d.end.getMonth()];
                        let date = startMonth + " " + startfullyear + "-" + endMonth + " " + endfullyear;
                        return date;
                    }
                })
                .attr("x", (d) => {
                    return x(d.start);
                })
                .attr("y", (d) => { return y1(d.lane + .5); })
                .attr("dy", "1.2ex")
                .attr("dx", "9ex")
                //write pointer and click fn
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
                    this.timelineChartClick(d)
                    this.fordrillableClick(this, d, event);
                    return tooltip.style("visibility", "hidden");
                });
        }
    }
    formTooltipData(tooltipData: any) {
        let object = {};

        let mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let label1 = "Duration";
        let label2 = "Name";
        let startfullyear = tooltipData.start.getFullYear();
        let startMonth = mlist[tooltipData.start.getMonth()]
        let endfullyear = tooltipData.end.getFullYear();
        let endMonth = mlist[tooltipData.end.getMonth()]
        let date = startMonth + " " + startfullyear + "-" + endMonth + " " + endfullyear;

        object[label2 + ":"] = tooltipData.id;
        object[label1 + ":"] = date;

        return this.toolTipForBar(object);

    }

    transformTODate(data: any) {
        this.urldata = [];

        data.forEach(element => {
            let dataobj = [];
            let startdate = new Date(element[1]);
            let enddate = new Date(element[2])
            dataobj.push(element[0]);
            dataobj.push(startdate);
            dataobj.push(enddate);
            this.urldata.push(dataobj);

        });
    }

    transformData(data: any) {
        this.lanes = [];
        this.timelinechartData = [];
        this.legends = [];
        let datalength = data.length - 1;
        let length = data.length;
        this.mindate = data[0][1];
        this.maxdate = data[datalength][2];
        let mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        data.forEach((element, i) => {
            let dataObj = { "lane": "", "id": "", "start": "", "end": "" };
            this.lanes.push(element[0]);
            dataObj["lane"] = i;
            dataObj["id"] = element[0];
            dataObj["start"] = element[1];
            dataObj["end"] = element[2];
            this.timelinechartData.push(dataObj);
        });

        this.timelinechartData.forEach((element, i) => {

            let startfullyear = element.start.getFullYear();
            let startMonth = mlist[element.start.getMonth()]
            let endfullyear = element.end.getFullYear();
            let endMonth = mlist[element.end.getMonth()]
            let date = startMonth + " " + startfullyear + "-" + endMonth + " " + endfullyear;
            let object = { 'label': this.lanes[i], 'color': this.predefinedcolors[i], 'Duration': date };
            this.legends.push(object);
        });

        let Obj = { "lane": "", "id": "", "start": "", "end": "" };
        Obj["lane"] = length;
        this.timelinechartData.push(Obj);
    }


    timelineChartClick(event: any) {
        let object = {};
        let mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let startfullyear = event.start.getFullYear();
        let startMonth = mlist[event.start.getMonth()]
        let endfullyear = event.end.getFullYear();
        let endMonth = mlist[event.end.getMonth()];
        let date = startMonth + " " + startfullyear + "-" + endMonth + " " + endfullyear;
        object["Name"] = event.id;
        object["Duration"] = date;
        this.chartClick(object);
    }

    //RESIZE STEP 4 STARTS
  validateresize() {
    setTimeout(() => {
      // debugger;
      if (this.wt) {

      } else {
        this.resize();
      }
    }, 2000)
  }
  //RESIZE STEP 4 ENDS

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
        this.plotChart();

    }
    timelinelegendClick(event: any) {
        let obj = {};
        for (let [key, value] of Object.entries(event)) {
            if (key !== 'color') {
                obj[key] = value;
            }
        }
        this.onLegendClick.emit(obj);
    }

}



