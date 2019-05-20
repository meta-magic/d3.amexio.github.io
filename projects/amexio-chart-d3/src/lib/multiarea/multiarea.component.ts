import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, ChangeDetectorRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import * as d3 from 'd3';
import { Key } from 'selenium-webdriver';
import { DeviceQueryService } from '../services/device.query.service';

@Component({
  selector: 'amexio-d3-chart-multiarea',
  templateUrl: './multiarea.component.html',
  styleUrls: ['./multiarea.component.css']
})
export class MultiareaComponent extends AmexioD3BaseChartComponent implements PlotCart, OnInit {
  @Input('width') svgwidth: number;
  @Input('height') svgheight: number = 350;
  @Input('color') colorarray = [];
  @Input('yaxis-interval') tickscount: number;
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
  @Output() onLegendClick: any = new EventEmitter<any>();
  @Output() onTooltipClick: any = new EventEmitter<any>();
  httpresponse: any;
  togglelabel: boolean = false;
  svg: any;
  x: any;
  y: any;
  z: any;
  height: number;
  width: number;
  margin: any = {};
  i: number;
  parseTime: any;
  keyArray: any[] = [];
  maximumValue: number;
  predefinedColors: any[];
  areaArray: any;
  transformeddata: any[] = [];
  data1: any[] = [];
  legendArray: any[] = [];
  tooltip: any;
  wt: number;
  constructor(private myservice: CommanDataService, private cdf: ChangeDetectorRef, private device: DeviceQueryService) {
    super("areachart");
  }

  ngOnInit() {
    this.wt = this.svgwidth;
    this.togglelabel = false;
    let res;
    if (this.level <= 1) {
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          this.httpresponse = response;
          this.data = this.getResponseData(response);
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.transformData(this.data);
            this.initAreaChart();
            this.plotD3Chart();
          }, 0);
        });
      } else if (this.data1) {

        setTimeout(() => {
          this.transformData(this.data);
          this.initAreaChart();
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
      this.initAreaChart();
      this.plotD3Chart();

    }, 0);
  }

  initAreaChart() {
    this.tooltip = this.toolTip(d3);
    if (this.resizeflag == false) {
     //RESIZE STEP 1
     if (this.wt) {
      this.svgwidth = this.wt;

    } else if (this.chartId) {
      this.svgwidth = this.chartId.nativeElement.offsetWidth;

    }
    //RESIZE STEP 1 ENDS HERE 
    }

    this.margin = { top: 30, right: 44, bottom: 50, left: 30 },
      this.width = this.svgwidth - this.margin.left - this.margin.right,
      this.height = this.svgheight - this.margin.top - this.margin.bottom;
    //find max and initialize max
    this.maximumValue = this.findMaxData(this.data);

    this.x = d3.scalePoint()
      .range([0, this.width])
    // .padding(0.1);

    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);
    this.areaArray = [];
    //set x y domain
    this.areaArray = this.data.map((d) => { return d[Object.keys(d)[0]]; });
    this.x.domain(this.areaArray);
    this.y.domain([0, this.maximumValue]);
    //initialize svg
    this.svg =
      d3.select("#" + this.componentId) 
      .attr('viewBox', '0 0 ' + this.svgwidth + ' ' + this.svgheight)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
    this.predefinedColors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  }

  plotD3Chart() {
    this.formLegendData();
    let counter: number;
    let g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    // add the X 
    if (this.device.IsDesktop() == true) {
      if (this.svgwidth <= 400) {
        g.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(this.x)).
          selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(60)")
          .style("text-anchor", "start");
      }
      else {
        g.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x))
      }
    }
    else {
      g.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(this.x)).
        selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

    }
    // add the Y Axis
    g.append("g")
      .call(d3.axisLeft(this.y).ticks(this.tickscount));

    this.plotLine(g, this.x, this.y, this.height, this.width);

    for (counter = 1; counter < this.keyArray.length; counter++) {
      let innerGroup = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      this.plotAreaChart(innerGroup, counter, this);
    }
    //call method to plot points
    let increment;
    for (increment = 1; increment < this.keyArray.length; increment++) {
      //plot line
      let innerGroup = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
      this.PlotLineDot(innerGroup, increment, this);
    }//increment for ends
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

  PlotLineDot(g: any, i: number, thisa: this) {
    let flag = this.togglelabel;
    const line = d3.line()
      .x((d) => { return thisa.x(d[Object.keys(d)[0]]); })
      .y((d) => { return thisa.y(d[Object.keys(d)[i]]); });
    g.append("path")
      .data([thisa.data])
      .attr("fill", "none")
      .attr("stroke", 
      (d)=>{
        if(this.colorarray.length > 0) {
          if(this.colorarray[i-1]) {
            return this.colorarray[i-1];
          }
          else {
        return thisa.predefinedcolors[i];            
          }
        }
        else {
        return thisa.predefinedcolors[i];
        }
      }
      // thisa.predefinedcolors[i]
    )
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .attr("opacity", 0.2)
      .attr("transform",
        // "translate(" + this.margin.left + "," + 0 + ")");
        "translate(" + 0 + "," + 0 + ")");
    //----------

    g.selectAll('dot')
      .data(thisa.data)
      .enter()
      .append('circle')
      .attr('opacity', 0)
      .attr("fill", 
      (d)=>{
        if(this.colorarray.length > 0) {
          if(this.colorarray[i-1]) {
            return this.colorarray[i-1];
          }
          else {
        return thisa.predefinedcolors[i];            
          }        }
        else {
        return thisa.predefinedcolors[i];
        }
      }
      // thisa.predefinedcolors[i]
    )
      .attr("cx", (d) => { return thisa.x(d[Object.keys(d)[0]]); })
      .attr("cy", (d) => { return thisa.y(d[Object.keys(d)[i]]); })
      .attr('r', 4)
      .attr("cursor", "pointer")
      .on("mouseover", (d) => {
        this.formTooltipData(d, i);
        return this.tooltip.style("visibility", "visible");

      })
      .on("mousemove", (d) => {
        return this.tooltip.html(
          this.formTooltipData(d, i)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return this.tooltip.style("visibility", "hidden");
      })

      .style("opacity", 1)
      .on("click", (d) => {
        this.onAreaTooltipClick(d, i);
        this.fordrillableClick(this, d, event);
        return this.tooltip.style("visibility", "hidden");
        //this.chartClick(d);
      })
      .attr("transform",
        // "translate(" + this.margin.left + "," + 0 + ")");
        "translate(" + 0 + "," + 0 + ")");

    // -----------------------------------------------------------------
    if (this.labelflag) {
      g.selectAll('labels')
        .data(thisa.data)
        .enter()
        .append('text')
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", (d) => {
          if (this.labelcolor && this.labelcolor.length > 0) {
            return this.labelcolor;
          } else {
            return "black";
          }
        })
        .attr("x", (d) => {
          // let length = String(d[Object.keys(d)[i]]).length
          return thisa.x(d[Object.keys(d)[0]]) + 20;
        })
        .attr("y", (d) => {
          let key: any = [Object.keys(d)[i]];
          if (flag) {
            return thisa.y(d[key]) - 5;// fr up
          }
          else {
            return thisa.y(d[key]) + 15;
          }
          // return thisa.y(d[Object.keys(d)[i]]);
          //  return y(d[Object.keys(d)[1]])+yTextPadding;
        })
        .text((d) => {
          return d[Object.keys(d)[i]];
        })
        .attr("transform",
          "translate(" + 0 + "," + 0 + ")")
        //label click logic
        .attr("cursor", "pointer")
      .on("mouseover", (d) => {
        this.formTooltipData(d, i);
        return this.tooltip.style("visibility", "visible");

      })
      .on("mousemove", (d) => {
        return this.tooltip.html(
          this.formTooltipData(d, i)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return this.tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.onAreaTooltipClick(d, i);
        this.fordrillableClick(this, d, event);
        return this.tooltip.style("visibility", "hidden");
        //this.chartClick(d);
      })
    }
    if (this.togglelabel) {
      this.togglelabel = false;
    }
    else {
      this.togglelabel = true;
    }
  }

  plotAreaChart(g: any, i: number, thisa: this) {
    // calculate area and valueline
    // define the line
    const valueline = d3.line()
      .x((d) => {
        let key: any = [Object.keys(d)[0]];
        return thisa.x(d[key]);
      })
      .y((d) => {
        let key: any = [Object.keys(d)[i]];
        return thisa.y(d[key]);
      });

    // add the valueline path.
    g.append("path")
      .data([this.data])
      .style("stroke",
      (d)=>{
        if(this.colorarray.length > 0) {
        //  return this.colorarray[i-1];
        if(this.colorarray[i-1]) {
          return this.colorarray[i-1];
        }
        else {
      return this.predefinedcolors[i];            
        }
        }
        else {
        return this.predefinedColors[i];
        }
      }
        // this.predefinedColors[i]
      )
      .attr("fill", "none")
      .style("stroke-width", "2px")
      .attr("d", valueline)
      .attr("transform",
        // "translate(" + this.margin.left + "," + 0 + ")");
        "translate(" + 0 + "," + 0 + ")");

    // define the area
    let area = d3.area()
      .x((d) => {
        let key: any = [Object.keys(d)[0]];
        return thisa.x(d[key]);
      })
      .y0(this.height)
      .y1((d) => {
        let key: any = [Object.keys(d)[i]];
        return thisa.y(d[key]);
      });

    g.append("path")
      .data([this.data])
      .attr("d", area)
      .attr("transform",
        // "translate(" + this.margin.left + "," + 0 + ")")
        "translate(" + 0 + "," + 0 + ")")
      .style("stroke", "none")
      .attr("fill", 
      (d)=>{
        if(this.colorarray.length > 0) {
          if(this.colorarray[i-1]) {
            return this.colorarray[i-1];
          }
          else {
        return this.predefinedcolors[i];            
          }        }
        else {
        return this.predefinedColors[i];
        }
      }
      // this.predefinedColors[i]
      )
      .style("opacity", 0.5)
  }

  onAreaTooltipClick(tooltipData: any, count: number) {
    let obj = {};
    obj[this.keyArray[0]] = tooltipData[Object.keys(tooltipData)[0]];
    obj[this.keyArray[count]] = tooltipData[Object.keys(tooltipData)[count]];
    this.chartClick(obj);
  }

  findMaxData(data: any) {
    let tempArray = [];
    let largeValues = [];
    let maxValue;
    //logic to search 3 largest values 
    data.forEach(element => {
      let temp = [];
      let value;
      for (let [key, value] of Object.entries(element)) {
        //exempts first column of data as it is treated as x-axis
        if (key != this.keyArray[0]) {
          tempArray.push(value);
        }
      }//for loop end
      value = this.findLargestValue(tempArray);
      largeValues.push(value);
    });
    maxValue = this.findLargestValue(largeValues);
    return maxValue;
  }

  findLargestValue(array: any[]) {
    let i;
    let max = 0;
    for (i = 0; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
      }//if ends 
    }//max ends
    return max;
  }

  //covert data
  transformData(data: any) {
    this.transformeddata = [];
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

    let parsedtransformeddata = JSON.parse(JSON.stringify(this.transformeddata));

    this.data = parsedtransformeddata;
  }

  formLegendData() {
     this.legendArray = [];
    let counter = 0
    this.keyArray.forEach((element, index) => {
      if (index > 0) {
        let legendobject = {};
        legendobject['label'] = element;
        if((this.colorarray.length > 0) && (this.colorarray[counter])) {
          legendobject['color'] = this.colorarray[counter];
        }
        else {
          legendobject['color'] = this.predefinedColors[counter + 1];
         }
        this.legendArray.push(legendobject);
        counter++;

      }
    });
  }

  onAreaLegendClick(legendData: any) {
     let obj = {};
    obj["label"] = legendData.label;
    let data = [];
    this.data.forEach(element => {
      for (let [key, value] of Object.entries(element)) {
        if (key == legendData.label) {
          let object = {};
          object[key] = value;
          data.push(object);
        }//inner if ends
      }//inner forloop ends
    });//outer foreach ends
    obj["data"] = data;
    this.onLegendClick.emit(obj);
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
    this.initAreaChart();
    this.plotD3Chart();
  }

  formTooltipData(tooltipData: any, count: number) {
    let obj = {};
    obj[this.keyArray[0]] = tooltipData[Object.keys(tooltipData)[0]];
    obj[this.keyArray[count]] = tooltipData[Object.keys(tooltipData)[count]];
    return this.toolTipForBar(obj);
  }

  plotLine(g, x, y, height, width) {
    if (this.hScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat('').ticks(this.tickscount));
    }
  }

  validateData() {
    if (this.data) {

    } else {
        return "lmask"
    }
}

}
