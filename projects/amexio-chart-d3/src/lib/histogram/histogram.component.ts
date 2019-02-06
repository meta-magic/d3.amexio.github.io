import { Component, Input, ViewChild, ElementRef, OnInit } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import { DeviceQueryService } from '../services/device.query.service';
import * as d3 from 'd3';
@Component({
  selector: 'amexio-d3-chart-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent extends AmexioD3BaseChartComponent implements OnInit {
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 400;
  @Input('color') color: string = "blue";
  @Input('data') datahisto: any;
 
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
 
  httpresponse: any;
  svg: any;
  data1: any;
  values: any[] = [];
  array: any[] = [];
  xaxisArray: any[] = [];
  yaxisArray: any[] = [];
  yaxisData: any[] = [];
  histogramarray: any[] = [];
  histogramdata: any[] = []
  lengtharray: any[] = [];
  arrayofLength: any[] = [];
  chartData: any[] = [];
  finaldataarray: any[] = [];
  legendArray: any[];
  keyArray: any[];
  predefinedcolors: any[];
  legends: any[];
  charttype: string;
  data: any[];
  datareaderdata: any[];
  xaxis: any;
  tempp: any;
  tooltipArray: any[] = [];
  index = 0;
  constructor(private myservice: CommanDataService, private device: DeviceQueryService) {
    super('histogram');
  }

  ngOnInit() {
    let res: any
    if (this.level <= 1) {
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          res = response;
          this.httpresponse = response;
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.datahisto = [];
            this.datahisto = this.getResponseData(res);
            this.transformData()
            this.plotXaxis();
            this.plotYaxis();
            this.tooltipData();
            this.dataforChart();
            this.transformData1(this.finaldataarray);
            this.plotChart();

          }, 0);

        });

      } else if (this.datahisto) {


        setTimeout(() => {
          this.datahisto = this.getResponseData(this.datahisto);
          this.transformData()
          this.plotXaxis();
          this.plotYaxis();
          this.tooltipData();
          this.dataforChart();
          this.transformData1(this.finaldataarray);
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
      this.datahisto = this.getResponseData(this.httpresponse);
      this.transformData()
      this.plotXaxis();
      this.plotYaxis();
      this.tooltipData();
      this.dataforChart();
      this.transformData1(this.finaldataarray);
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

  transformData1(data1: any) {
    this.keyArray = [];
    this.legendArray = [];
    data1.forEach((element, i) => {
      if (i == 0) {
        element.forEach((innerelement, index) => {
          if (index > 0) {
            this.legendArray[innerelement] = { 'data': [] };
            this.keyArray.push(innerelement);
          }
          else if (index == 0) {
            this.xaxis = innerelement;
          }
        });
      }
    });
    let tempinnerarray: any[];
    tempinnerarray = [];
    data1.forEach((element, index) => {
      if (index > 0) {
        let obj: any = {};
        element.forEach((innerelement, innerindex) => {
          if (innerindex >= 0) {
            const key = this.keyArray[innerindex - 1];
            obj[key] = element[innerindex];
            const legenddata = this.legendArray[key];
            if (legenddata) {
              legenddata.data.push({ 'value': element[innerindex], 'label': element[0] });
            }
          }
        });
        tempinnerarray.push(obj);
      }

    });
    this.data = [];
    tempinnerarray.forEach(element => {
      this.data.push(element);
    });
    this.legends = [];
    let element = this.datahisto[0];
    let object = { 'label': element[1] + " " + "of" + " " + element[0], 'color': this.color };
    this.legends.push(object);
  }

  plotChart() {

    const tooltip = this.toolTip(d3);
    let data;
    data = this.data;
    let keysetarray: string[] = [];
    let series;
    series = [];
    series = d3.stack().keys(this.keyArray)
      .offset(d3.stackOffsetDiverging)
      (this.data);
    let i = 0;
    let tempdata;
    tempdata = [];
    tempdata = series;
    tempdata.forEach(element => {
      element.forEach(innerelement => {
        let singletooltip = [];
        singletooltip.push(innerelement.data.tooltipdata[i]);
        innerelement.push(singletooltip);
      });
      i++;
    });

    let chartdata = [];
    for (i = 0; i < tempdata.length - 1; i++) {
      chartdata.push(tempdata[i]);
    }
    if (this.resizeflag == false) {
      if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;
      } else {

        this.svgwidth = this.svgwidth;
      }
    }
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = this.svgwidth - margin.left - margin.right;
    const height = this.svgheight - margin.top - margin.bottom;

    //const height = +svg.attr("height") - margin.top - margin.bottom;

    let x, y;

    this.svg = d3.select("#" + this.componentId)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let barWidth = (width / this.chartData.length);
    let inc = barWidth / 2;
    x = d3.scalePoint()
      .domain(this.xaxisArray,(d)=> { return d; })
      .rangeRound([0, width]);


    y = d3.scaleLinear().rangeRound([height, 0]);
    y.domain([0, d3.max(this.arrayofLength)]);

    let z = d3.scaleOrdinal(d3.schemeCategory10);
    this.arrayofLength = [];
    // add x axis to svg

    if (this.device.IsDesktop() == true) {
      this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    }
    else {
      this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)).
        selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

    }

    let horizontalpadding = 0.05;
    //add y axis to svg
    this.svg.append("g")
      .call(d3.axisLeft(y));

    this.plotLine(this.svg, x, y, height, width);
   
 let histogramBar = this.svg.append("g")
      .selectAll("g")
      .data(chartdata)
      .enter().append("g")
      .attr("fill", this.color)
      .selectAll("rect")
      .data((d) => {
        return d;
      })

    let histogramBar1 = this.svg.append("g")
      .selectAll("g")
      .data(chartdata)
      .enter().append("g")
      // .attr("fill", this.color)
      .selectAll("labels")
      .data((d) => {
        return d;
      })
    let cnt = 0;


    histogramBar.enter().append("rect")
      .attr("width", barWidth - 1)
      .attr("y", (d, index) => {
        cnt++;
        return y(d[1]);
      })
      .attr("cursor", "pointer")
      .attr("height", (d, index) => {
        return Math.abs(y(d[0]) - y(d[1] - horizontalpadding));
      })
      .attr("transform",(d, i)=> {
        let translate = [barWidth * i, 0];
        return "translate(" + translate + ")";
      })
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      }).on("mousemove",
        (d: any) => {
          let data = d[2];
          return tooltip.html(this.setKey(data[0]))
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");

        }).on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
      .on("click", (d) => {
        let clickdata = d[2];
        this.histogramClick(clickdata[0]);
        this.fordrillableClick(this, d, event);
        return tooltip.style("visibility", "hidden");
      });
   if(this.labelflag) {
    histogramBar1.enter()
      .append("text")
      .style("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("fill", (d) => {
        if(this.labelcolor && this.labelcolor.length>0){
          return this.labelcolor;
        } else {
        return "black";
        }
      })
      .attr("y",(d, i)=> {
        return y(d[1]);
      })
      .text((d)=> {
       
        let data: any;
        let data2: any;
        data = d[2];
        data2 = data[0];
        if (data2) {
          return data2.value;
        }
        else {
          return null;
        }
      })
      .attr("transform",(d, i)=> {
        let translate = [((barWidth * i) + barWidth / 2), (Math.abs(y(d[0]) - y(d[1] - horizontalpadding)))];
        return "translate(" + translate + ")";
      })
      //label click logic
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      }).on("mousemove",
        (d: any) => {
          let data = d[2];
          return tooltip.html(this.setKey(data[0]))
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");

        }).on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
      .on("click", (d) => {
        let clickdata = d[2];
        this.histogramClick(clickdata[0]);
        this.fordrillableClick(this, d, event);
        return tooltip.style("visibility", "hidden");
      })
      .attr("cursor", "pointer")

    }
  }

  histogramClick(obj: any) {
    let object = {};
    let data = this.datahisto[0];
    let label1 = data[1];
    let label2 = data[0];
    if (obj.label.length) {
      object[label2 + ":"] = obj.label;
      object[label1 + ":"] = obj.value;
    }
    this.chartClick(object);
  }

  legendClick(event: any) {
    this.onLegendClick.emit(this.datahisto);
  }

  transformData() {
    this.array = [];
    this.values = [];
    this.datahisto.forEach(element => {
      this.values.push(element[1]);
    });
    for (let i = 1; i < this.values.length; i++) {
      this.array.push(this.values[i]);
    }
  }

  plotXaxis() {
    this.xaxisArray = [];
    this.xaxisArray.push(0);
    let newvalue: number = 0;
    let value = Math.ceil(d3.max(this.array));
    if (value % 10 == 0) {
      value = value;
    } else {
      value = (10 - value % 10) + value;
    }
    let quotient = value / 5;
    while (newvalue < value) {
      newvalue = newvalue + quotient;
      this.xaxisArray.push(newvalue);
    }
  }

  plotYaxis() {
    let tempvalue = 0;
    let lengthofArray = 0;
    let lengthcount = 0;
    let templength = 0;
    let newvalue: number = 0;
    this.yaxisArray = [];
    this.histogramarray = [];
    this.lengtharray = [];
    this.histogramdata = [];
    this.arrayofLength = [];
    this.chartData = [];
    this.xaxisArray.forEach(element1 => {
      this.yaxisArray = [];
      this.array.forEach(element2 => {
        if (tempvalue < element2 && element2 <= element1) {
          this.yaxisArray.push(element2);
        }
        lengthofArray = this.yaxisArray.length;
      });
      if (templength > lengthofArray) {
        lengthcount = templength;
      }
      else {
        lengthcount = lengthofArray;
      }
      templength = lengthcount;
      tempvalue = element1;
       this.lengtharray.push(lengthofArray);
    });

    let value = Math.ceil(templength);
    let quotient = value / 5;
    while (newvalue <= value) {
      newvalue = newvalue + quotient;
      this.yaxisData.push(newvalue)
    }

    for (let i = 1; i < this.histogramarray.length; i++) {
      this.histogramdata.push(this.histogramarray[i]);
    }

    for (let i = 1; i < this.lengtharray.length; i++) {
      this.arrayofLength.push(this.lengtharray[i]);
    }
    for (let i = 0; i < this.arrayofLength.length; i++) {
      let data = {};
      data["value"] = this.arrayofLength[i];
      this.chartData.push(data);
    }
    this.array = [];

  }

  resize() {

    this.svgwidth = 0;
    this.svg.selectAll("*").remove();

    this.resizeflag = true;
    this.svgwidth = this.divid.nativeElement.offsetWidth;

    this.transformData()
    this.plotXaxis();
    this.plotYaxis();
    this.tooltipData();
    this.dataforChart();
    this.transformData1(this.finaldataarray);
    this.plotChart();
  }

  dataforChart() {
    this.finaldataarray = [] = [];
    let initialArray: any[] = [];
    let temparray: any[] = [];
    initialArray.push('level');
    let maxElement = Math.max.apply(null, this.arrayofLength);
    let maxlength = maxElement;
    let n = 1;
    while (n <= maxElement) {
      initialArray.push('' + n)
      n++;
    }
    initialArray.push('tooltipdata');
    let length = this.arrayofLength.length;
    let num = 1;
    let number = 1;
    let j = 0;
    this.finaldataarray.push(initialArray);

    for (let i = 0; i < this.arrayofLength.length; i++) {
      let value = this.arrayofLength[i];
      let tempvalue = value;
      temparray = [];
      temparray.push('' + i);
      maxElement = maxlength;
      if (value > 0) {
        while (value != 0) {
          temparray.push(number);
          value--
        }
        maxElement = maxElement - tempvalue;

        while (maxElement != 0) {
          temparray.push(0);
          maxElement--;
        }
      }
      else {
        while (maxElement != 0) {
          temparray.push(0);
          maxElement--;
        }
      }
      temparray.push(this.tooltipArray[j])
      this.finaldataarray.push(temparray);
      j++;
    }
  }


  tooltipData() {
    let arrayofTooltip: any[] = [];
    let obj = { "label": "", "value": "" };
    this.datahisto.forEach(element => {
      obj = { "label": "", "value": "" };
      obj["label"] = element[0];
      obj["value"] = element[1];
      arrayofTooltip.push(obj);
    });

    let value1 = this.xaxisArray[0];

    let tooltipdata: any[] = [];
    for (let j = 1; j < this.xaxisArray.length; j++) {
      tooltipdata = [];
      let value2 = this.xaxisArray[j];

      arrayofTooltip.forEach(element => {

        if (value1 <= element.value && element.value <= value2) {

          let tooltipobj = { "label": "", "value": "" }
          tooltipobj["label"] = element["label"];
          tooltipobj["value"] = element["value"];
          tooltipdata.push(tooltipobj);


        }

      });
      this.tooltipArray.push(tooltipdata);
      value1 = value2;
    }
  }


  setKey(obj: any) {

    let object = {};
    let data = this.datahisto[0];
    let label1 = data[1];
    let label2 = data[0];

    object[label2 + ":"] = obj.label;
    object[label1 + ":"] = obj.value;

    return (this.toolTipForBar(object))
  }

  plotLine(g, x, y, height, width) {
    if (this.hScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat(''));
    }
  }
}
