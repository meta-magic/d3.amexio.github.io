import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import{DeviceQueryService} from '../services/device.query.service';
import * as d3 from 'd3';
@Component({
  selector: 'amexio-d3-chart-waterfall',
  templateUrl: './candlestick.component.html',
  styleUrls: ['./candlestick.component.css']
})

export class CandlestickComponent extends AmexioD3BaseChartComponent implements PlotCart, OnInit {
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @Input('data-reader') datareader: any;
  @Input() data: any[];
  @Input('level') level: number = 0;
  @Input('target') target: number;
  @Input('drillable-data') drillabledatakey: any[] = [];
  @Input('label-color') labelcolor: string = "black";
  @Input('label') labelflag: boolean = false;
  @Input('horizontal-scale') hScale: boolean = true;
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
  @Output() onLegendClick: any = new EventEmitter<any>();
  drillableFlag: boolean = true;
  resizeflag: boolean = false;
  predefinedColor = [];
  keyArray: any[] = [];
  transformeddata: any;
  height: number;
  width: number;
  margin: any = {};
  x: any;
  y: any;
  svg: any;
  tooltip: any;
  legendArray: any[] = [];
  httpresponse: any;
  constructor(private myservice: CommanDataService,private device:DeviceQueryService) {
    super("candlestickwaterfallchart");
  }

  ngOnInit() {
    this.predefinedColor = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    if (this.level <= 1) {
      let res;
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          //this.data = response;
          this.httpresponse = response;
          this.data = this.getResponseData(response);
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.transformData(this.data);
            this.initializeData();
            this.plotXYAxis();
            this.plotD3Chart();
          }, 0);
        });
      } else if (this.data) {
        setTimeout(() => {
          this.transformData(this.data);
          this.initializeData();
          this.plotXYAxis();
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
        this.httpresponse = response;
      }, (error) => {
      }, () => {
        setTimeout(() => {
          //this.data = this.getResponseData(resp);
          this.drawChart();
        }, 0);
      });

    }
  }

  drawChart() {
    setTimeout(() => {
      this.data = this.getResponseData(this.httpresponse);
      this.transformData(this.data);
      this.initializeData();
      this.plotXYAxis();
      this.plotD3Chart();
    }, 0);
  }

  initializeData() {
    this.tooltip = this.toolTip(d3);
    if (this.resizeflag == false) {
      if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;
      } else {
        this.svgwidth = this.svgwidth;
      }
    }
    this.margin = { top: 20, right: 30, bottom: 50, left: 60 },
      this.width = this.svgwidth - this.margin.left - this.margin.right,
      this.height = this.svgheight - this.margin.top - this.margin.bottom;
  }

  plotXYAxis() {
    // set the ranges
    this.x = d3.scaleBand().range([0, this.width]);
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);
    // scale the range of the data
    let candlestickArray = this.data.map((d) => {
      return d[Object.keys(d)[0]];
     });
    this.x.domain(candlestickArray);
    let max = d3.max(this.data, (d) => { return d.end; });
    this.y.domain([0, max]);

    this.svg = d3.select("#" + this.componentId)
      // d3.select("body").append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")");

    // add the X Axis

    if(this.device.IsDesktop()==true)
    {
      this.svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(this.x))
    }
  else
   {
     this.svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(this.x)).
           selectAll("text")
           .attr("y", 0)
           .attr("x", 9)
           .attr("dy", ".35em")
           .attr("transform", "rotate(60)")
           .style("text-anchor", "start");

  }

    // this.svg.append("g")
    //   .attr("transform", "translate(0," + this.height + ")")
    //   .call(d3.axisBottom(this.x));

    // add the Y Axis
    this.svg.append("g")
      .call(d3.axisLeft(this.y));
    this.plotLine(this.svg, this.x, this.y, this.height, this.width);
  }


  plotD3Chart() {
    let bar = this.svg.selectAll(".bar")
      .data(this.data)
      .enter().append("g")
      .attr("class", (d) => { return "bar " + d.class })
      .attr("transform", (d) => {
        return "translate(" + this.x(
          d[Object.keys(d)[0]]
         ) + ",0)";
      });

    bar.append("rect")
      .attr("y", (d) => { return this.y(Math.max(d.start, d.end)); })
      .attr("height", (d) => { return Math.abs(this.y(d.start) - this.y(d.end)); })
      .attr("width", this.x.bandwidth())
      .attr("fill", (d, i) => {
        return this.predefinedColor[i];
      })
      .attr("cursor", "pointer")
      .on("mouseover", (d) => {
        this.formTooltipData(d);
        return this.tooltip.style("visibility", "visible");

      })
      .on("mousemove", (d) => {
        return this.tooltip.html(
          this.formTooltipData(d)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return this.tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.onCandlestickClick(d);
        this.fordrillableClick(this, d, event);
        return this.tooltip.style("visibility", "hidden");
      })
    
    if(this.labelflag) {
    bar.append("text")
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
      .attr("x", (d) => {
        return (this.x.bandwidth()) / 2;
      })
      .attr("y", (d, index) => {
        return this.y(Math.max(d.start, d.end)) + 20;
       })
      .text(function (d) {
         return d[Object.keys(d)[1]]
       });
      }
  }

  plotLine(svg, x, y, height, width) {
    if (this.hScale) {
      svg.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat(''));
    }
  }

  transformData(data: any) {
    this.transformeddata = [];
    this.keyArray = [];
    this.keyArray = data[0];
    data.forEach((element, index) => {
      if (index > 0) {
        let DummyObject: any = {};
        element.forEach((individualvalue, keyindex) => {
          DummyObject[this.keyArray[keyindex]] = individualvalue;
        });//inner for loop ends
        this.transformeddata.push(DummyObject);
      }//if ends
    });//outer for loop ends 
    this.data = this.transformeddata;
    this.addDataKeys();
    this.formLegendData();
  }

  addDataKeys() {
    let cumulative: any = 0;
    for (let i = 0; i < this.data.length; i++) {
      this.data[i]["start"] = cumulative;
      cumulative += this.data[i][this.keyArray[1]];
      this.data[i]["end"] = cumulative;
      this.data[i]["class"] = (this.data[i][this.keyArray[1]] >= 0) ? 'positive' : 'negative'
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

  formTooltipData(tooltipData: any) {
    let object = {};
    object[this.keyArray[0]] = tooltipData[Object.keys(tooltipData)[0]];
    object[this.keyArray[1]] = tooltipData[Object.keys(tooltipData)[1]];
    return this.toolTipForBar(object);
  }

  onCandlestickClick(chartData: any) {
    let object = {};
    object[this.keyArray[0]] = chartData[Object.keys(chartData)[0]];
    object[this.keyArray[1]] = chartData[Object.keys(chartData)[1]];
    this.chartClick(object);
  }

  formLegendData() {
    this.legendArray = [];
    this.data.forEach((element, index) => {
      for (let [key, value] of Object.entries(element)) {
        if (key == this.keyArray[0]) {
          let object = {};
          object["label"] = value;
          object["color"] = this.predefinedColor[index];
          this.legendArray.push(object);
        }
      }
    });
  }

  onCandlestickLegendClick(chartData: any) {
    let object = {};
    this.data.forEach(element => {
      for (let [key, value] of Object.entries(element)) {
        if (value == chartData.label) {
          object[chartData.label] = element.value;
        }
      }
    });
    this.onLegendClick.emit(object);
  }

  resize() {
    this.svgwidth = 0;
    this.svg.selectAll("*").remove();
    this.resizeflag = true;
    this.svgwidth = this.divid.nativeElement.offsetWidth;
    this.initializeData();
    this.plotXYAxis();
    this.plotD3Chart();
  }

}
