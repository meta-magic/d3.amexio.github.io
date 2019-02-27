import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { CommanDataService } from '../services/comman.data.service';
import { DeviceQueryService } from '../services/device.query.service';

@Component({
  selector: 'amexio-d3-chart-barstack',
  templateUrl: './barstack.component.html',
  styleUrls: ['./barstack.component.css']
})
export class BarstackComponent extends AmexioD3BaseChartComponent implements OnInit {
  legendArray: any[];
  maxYValue: number = 0;
  keyArray: any[];
  predefinedcolors: any[];
  legends: any[];
  charttype: string;
  data: any[];
  datareaderdata: any[];
  xaxis: any;
  wt: number;
  @Input('data') data1: any
  @Input() barwidth: number = 0;
  @Input() title: String = "";
  @Input() legend: boolean = true;
  @Input() color: string[] = [];
  @Input('width') svgwidth: number;
  @Input('height') svgheight: number = 300;
  @Input('yaxis-interval') tickscount: number;
 
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
  @ViewChild('drillid') drillid: any;
  @Output() onLegendClick: any = new EventEmitter<any>();
  httpresponse: any;
  svg: any;
  offsetheight: any;
  constructor(private myservice: CommanDataService, private cdf: ChangeDetectorRef, private device: DeviceQueryService) {
    super('barstack');
  }

  ngOnInit() {
    this.wt = this.svgwidth;
    if (this.level <= 1) {
      let res;
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          this.httpresponse = response;
          this.data = this.getResponseData(response);
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.transformData(this.data);
            this.plotChart();
          }, 0);
        });
      } else if (this.data1) {
        setTimeout(() => {
          this.transformData(this.data1);
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
          this.drawChart();
        }, 0);
      });
    }
  }

  drawChart() {
    setTimeout(() => {
      this.data = this.getResponseData(this.httpresponse);
      this.transformData(this.data);
      this.plotChart();
    }, 0);
  }


  transformData(data1: any) {
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
    let maxY: any = 0;
    let yaxismaxArray = [];
    //find max for yaxis
    this.data.forEach((element) => {
      for (let [key, value] of Object.entries(element)) {

        this.keyArray.forEach(key1 => {
          if (key == key1) {
            maxY = maxY + value;
          }
        });//keyarray loop ends here

      }//for ends here
      yaxismaxArray.push(maxY);
      maxY = 0;
    });// foreach ends
    let tempLarge = 0, i;
    for (i = 0; i < yaxismaxArray.length; i++) {
      if (yaxismaxArray[i] > tempLarge) {
        this.maxYValue = yaxismaxArray[i];
      }//if ends
    }// for ends

    this.legends = []
    this.keyArray.forEach((element, index) => {
      const legenddata = this.legendArray[element];
      if (this.color.length > 0) {
        let object = { 'label': element, 'color': this.color[index], 'data': legenddata.data };
        this.legends.push(object);
      } else {
        let object = { 'label': element, 'color': this.predefinedcolors[index], 'data': legenddata.data };
        this.legends.push(object);
      }
    });
  }

  plotChart() {
    const tooltip = this.toolTip(d3);
    let margin = { top: 20, right: 30, bottom: 90, left: 60 };
    let colors = this.predefinedcolors;
    if (this.device.IsDesktop()) {
      //RESIZE STEP 1
      if (this.wt) {
        this.svgwidth = this.wt;

      } else if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;

      }
      //RESIZE STEP 1 ENDS HERE 
    }
    //this.svgwidth = this.chartId.nativeElement.offsetWidth;
    let data;
    data = this.data;
    let keysetarray: string[] = [];
    if (this.httpmethod && this.httpurl) {
      for (let [key, value] of Object.entries(this.data[0])) {
        keysetarray.push(key);
      }
      this.keyArray = keysetarray;
      this.keyArray.splice(0, 1);
    }
 

    let series = d3.stack().keys(this.keyArray)
      .offset(d3.stackOffsetDiverging)
      (this.data);

     let width = this.svgwidth - margin.left - margin.right;
    let height
    //  = this.svgheight - margin.bottom - margin.top;
    this.svg = d3.select("#" + this.componentId)
                 .attr('viewBox', '0 0 ' + this.svgwidth + ' ' + this.svgheight)
                
    if (this.device.IsDesktop()) {

      this.offsetheight = this.chartId.nativeElement.offsetHeight
      //  - margin.bottom -margin.top;
      height = this.offsetheight;
    }
    else {
      height = this.chartId.nativeElement.offsetHeight - 10;
    }

    let x = d3.scaleBand()
      .domain(data.map((d) => {
        return d[Object.keys(d)[0]];
      }))
      .rangeRound([margin.left, this.svgwidth-margin.right])
      .padding(0.35);

    let y = d3.scaleLinear()
      .domain([d3.min(this.stackMin(series)),
      this.maxYValue
        // d3.max(this.stackMax(series))
      ])
      .rangeRound([height - margin.bottom, margin.top]);
    if (this.device.IsDesktop() == true) {
      if (this.svgwidth <= 400) {
        this.svg.append("g")
          .attr("transform", "translate(0," + y(0) + ")")
          .call(d3.axisBottom(x)).
          selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(60)")
          .style("text-anchor", "start");
      } else {
        this.svg.append("g")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x));
      }

    }
    else {
      this.svg.append("g")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x)).
        selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");
    }

    this.svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y).ticks(this.tickscount));

    this.plotLine(this.svg, x, y, height, width, margin.left)

    let svgRect = this.svg.append("g")
      .selectAll("g")
      .data(series)
      .enter().append("g")
      .attr("fill", (d, index) => {
        if (this.color.length > 0) {
          if (this.color[index]) {
            return this.color[index];
          }
          else {
            return colors[index];
          }
        }
        else {
          return colors[index];
        }
      })
      .selectAll("rect")
      .data((d) => {
        return d;
      })

    svgRect.enter().append("rect")
      .attr("width", x.bandwidth()).attr('id', (d, i) => {
        return d.data[i];
      })
      .attr("x", (d) => {
        return x(+d.data[Object.keys(d.data)[0]]);
      })
      .attr("y", (d, index) => {
        return y(d[1]);
      })
      .attr("cursor", "pointer")
      .attr("height", (d, index) => {
        return y(d[0]) - y(d[1]);
      })
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d: any) => {
        return tooltip.html(this.setKey(d))
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.setBarClickText(d);
        this.fordrillableClick(this, d, event);
        return tooltip.style("visibility", "hidden");
        // this.chartClick(d);
      });
    // -------------------------
    if (this.labelflag) {
      svgRect.enter()
        .append("text")
        .style("font-weight", "bold")
        .style("font-size", "1vw")
        .attr("text-anchor", "middle")
        .attr("fill", (d) => {
          if (this.labelcolor && this.labelcolor.length > 0) {
            return this.labelcolor;
          } else {
            return "black";
          }
        })
        .attr("x", (d) => {
          return x(+d.data[Object.keys(d.data)[0]]) + x.bandwidth() / 2;
        })
        .attr("y", (d, index) => {
          return y(d[1]) + 20;
        })
        .text((d) => {
          if((d[Object.keys(d)[1]] - d[Object.keys(d)[0]]) > 0) {
          return d[Object.keys(d)[1]] - d[Object.keys(d)[0]];
          }
        })
        .attr("cursor", "pointer")
        .on("mouseover", (d) => {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", (d: any) => {
          return tooltip.html(this.setKey(d))
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
        .on("click", (d) => {
          this.setBarClickText(d);
          this.fordrillableClick(this, d, event);
          return tooltip.style("visibility", "hidden");
          // this.chartClick(d);
        });
    }
  }

  stackMin(serie) {
    return d3.min(serie, (d) => { return d[0]; });
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

  resize() {
    this.svg.selectAll("*").remove();
    this.resizeflag = true;
    if (this.wt) {
      this.svgwidth = this.wt;
    } else if (this.chartId) {
      this.svgwidth = this.chartId.nativeElement.offsetWidth;
    }
    this.cdf.detectChanges();
    this.plotChart();
  }

  plotLine(svg, x, y, height, width, m) {
    if (this.hScale) {
      svg.append('g')
        .attr("transform", "translate(" + m + ",0)")
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y).ticks(this.tickscount)
          .tickSize(-width).tickFormat(''));
    }
  }

  legendClick(event: any) {
    let obj = {};
    obj["label"] = event.label;
    let data = [];
    event.data.forEach(element => {
      let object = {};
      object[element.label] = element.value;
      data.push(object);
    });
    obj["data"] = data;
    this.onLegendClick.emit(obj);
  }

  setKey(d: any) {
    let diff = d[0] - d[1];
    if (diff < 0) {
      diff = (diff * (-1));
    }
    for (let [key, value] of Object.entries(d.data)) {
      if (value == diff) {
        let object = {};
        object[key] = value;
        object[this.xaxis] = d.data[Object.keys(d.data)[0]];
        return (this.toolTipForBar(object));
      }
    }
  }

  setBarClickText(d: any) {
    let diff = d[0] - d[1];
    if (diff < 0) {
      diff = (diff * (-1));
    }
    let object = {};
    for (let [key, value] of Object.entries(d.data)) {
      if (value == diff) {
        object[key] = value;
        object[this.xaxis] = d.data[Object.keys(d.data)[0]];
      }
    }
    this.chartClick(object);
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

}
