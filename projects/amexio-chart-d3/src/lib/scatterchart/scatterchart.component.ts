import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { CommanDataService } from '../services/comman.data.service';
import{DeviceQueryService} from '../services/device.query.service';

import * as d3 from 'd3';

@Component({
  selector: 'amexio-d3-chart-scatter',
  templateUrl: './scatterchart.component.html',
  styleUrls: ['./scatterchart.component.css']
})
export class ScatterchartComponent extends AmexioD3BaseChartComponent implements OnInit {
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @Input('color') color: any = "blue";
 
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
 
  svg: any;
  keyArray: any[] = [];
  transformeddata: any[] = [];
  data: any;
  dataFormatted: any;
  colordata: any;
  legends: any[];
  legendarray: any[] = [];
  legendData: any;
  httpresponse: any;
  constructor(private myservice: CommanDataService, private device: DeviceQueryService) {
    super('scatter');
  }

  ngOnInit() {
    this.dataFormatted = [];
    if (this.level <= 1) {
      let resp: any;
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          resp = response;
          this.httpresponse = resp;
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.data = this.getResponseData(resp);
            this.dataFormatted = this.data;
            this.transformData(this.dataFormatted);
            this.colorGeneration();
            this.legendCreation();
            this.plotScatterChart();
          }, 0);
        });

      } else if (this.data) {

        setTimeout(() => {
          this.dataFormatted = this.data;
          this.data = this.getResponseData(this.data);

          this.transformData(this.data);
          this.colorGeneration();
          this.legendCreation();
          this.plotScatterChart();

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
      this.dataFormatted = this.data;


      this.transformData(this.data);
      this.colorGeneration();
      this.legendCreation();
      this.plotScatterChart();
    }, 0);
  }

  // Method to transform data in key value pair 
  transformData(data: any) {
    this.keyArray = data[0];
    data.forEach((element, index) => {
      if (index > 0) {
        let DummyObject = {};
        element.forEach((individualvalue, keyindex) => {
          DummyObject[this.keyArray[keyindex]] = individualvalue;
        });
        this.transformeddata.push(DummyObject);
      }
    });
    this.data = this.transformeddata;
  }

  // Method get response data using data reader
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

  // Method to plot d3 chart
  plotScatterChart() {
    if (this.resizeflag == false) {
      if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;
      } else {

        this.svgwidth = this.svgwidth;
      }
    }
    const tooltip = this.toolTip(d3);
    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const width = this.svgwidth - margin.left - margin.right;
    const height = this.svgheight - margin.top - margin.bottom;

    let x, y;

    x = d3.scaleLinear()
      .rangeRound([0, width]);

    y = d3.scaleLinear()
      .rangeRound([height, 0]);

    let xAxis = d3.axisBottom(x);

    let yAxis = d3.axisLeft(y);

    this.svg = d3.select("#" + this.componentId)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, d3.max(this.data,(d)=> { return d[Object.keys(d)[0]] })]);
    y.domain([0, d3.max(this.data,(d)=> { return d[Object.keys(d)[1]] })]);

    if (this.device.IsDesktop() == true) {
      this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start");
    }
    else {
      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis).
        selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");
    }



    // this.svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0," + height + ")")
    //   .call(xAxis)
    //   .append("text")
    //   .attr("class", "label")
    //   .attr("x", width)
    //   .attr("y", -6)
    //   .style("text-anchor", "end");

    this.svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")

    if (this.dataFormatted[0].length == 2) {
      this.plotLine(this.svg, x, y, height, width);

      this.svg.selectAll(".dot")
        .data(this.data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("fill", this.color)
        .attr("r", 4.5)
        .attr("cursor", "pointer")
        .attr("cx",(d) => {
           return x(d[Object.keys(d)[0]]);
        })
        .attr("cy",(d) => { return y(d[Object.keys(d)[1]]); })
        .on("mouseover", (d) => {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove",(d) => {
          return tooltip.html(
            this.formTooltipData(d)
          )
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
        .on("click", (d) => {
          this.scatterChartClick(d);
          this.fordrillableClick(this, d, event);
          return tooltip.style("visibility", "hidden");
        });
      // ------------------------------------------------------------------------------
      if (this.labelflag) {
        this.svg.selectAll("labels")
          .data(this.data)
          .enter().append("text")
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
            return x(d[Object.keys(d)[0]]) + 11;
          })
          .attr("y", (d, i) => {
            return y(d[Object.keys(d)[1]])
          })
          .text((d) => {
            return d[Object.keys(d)[1]];
          });
      }

    } else {
      this.plotLine(this.svg, x, y, height, width);

      this.svg.selectAll(".dot")
        .data(this.transformeddata)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 4.5)
        .attr("cursor", "pointer")
        .attr("cx",(d)=> {
          return x(d[Object.keys(d)[0]]);
        })
        .attr("cy",(d)=> { return y(d[Object.keys(d)[1]]); })
        .attr("fill",(d)=> { return d[Object.keys(d)[4]] })

        .on("mouseover", (d) => {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", (d) => {
          return tooltip.html(
            this.formTooltipData(d)
          )
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
        .on("click", (d) => {
          this.scatterChartClick(d);
          this.fordrillableClick(this, d, event);
          return tooltip.style("visibility", "hidden");
        })

        if (this.labelflag) {
          this.svg.selectAll("labels")
            .data(this.data)
            .enter().append("text")
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
              return x(d[Object.keys(d)[0]]) + 11;
            })
            .attr("y", (d, i) => {
              return y(d[Object.keys(d)[1]])
            })
            .text((d) => {
              return d[Object.keys(d)[1]];
            });
        }

    }

  }

  // Method to form tooltip data
  formTooltipData(tooltipData: any) {
    let object = {};
    for (let [key, value] of Object.entries(tooltipData)) {
      if (key != 'color') {
        object[key] = value;
      }
    }
    return this.toolTipForBar(object);
  }

  // Method on chart click
  scatterChartClick(event: any) {
    let object = {};
    for (let [key, value] of Object.entries(event)) {
      object[key] = value;
    }
    this.chartClick(object);
  }

  // method to create Legend
  legendCreation() {
    if (this.dataFormatted[0].length == 2) {
      this.legends = [];
      let element = this.dataFormatted[0];

      let object = { 'label': element[0] + " " + "vs" + " " + element[1], 'color': this.color };
      this.legends.push(object);
    }
    else {
      this.legends = [];
      this.legendarray.forEach(element => {
        let legendobject = {};
        legendobject['label'] = element.label;
        legendobject['color'] = element.color;
        this.legends.push(legendobject);
      });

    }

  }

  // Method on Legend Click
  onScatterLegendClick(legendevent: any) {
    if (this.dataFormatted[0].length == 2) {
      this.onLegendClick.emit(this.data);
    } else {
      this.legendarray.forEach(element => {
        if (legendevent.label == element.label) {
          this.legendClick(element.value);
        }
      });
    }
  }

  // Method for responsiveness
  resize() {
    this.svgwidth = 0;
    this.svg.selectAll("*").remove();

    this.resizeflag = true;
    this.svgwidth = this.divid.nativeElement.offsetWidth;
    this.plotScatterChart();


  }

  plotLine(g, x, y, height, width) {
    if (this.vScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).
          tickSize(-this.width).tickFormat('')
        );
    }
    if (this.hScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat(''));
    }
  }

  colorGeneration() {
    this.legendarray = [];
    let i = 0;
    let names = this.dataFormatted
      .map(e => e[2])
      .filter((e, i, a) => a.indexOf(e) === i);
    for (let j = 1; j < names.length; j++) {
      let value = [];
      let obj = { "label": "", "color": "", "value": [] };
      this.transformeddata.forEach(element => {
        if (element[Object.keys(element)[2]] == names[j]) {
          element['color'] = this.predefinedcolors[i];
          value.push(element);
        }
      });
      obj["value"] = value;
      obj["label"] = names[j];
      obj["color"] = this.predefinedcolors[i];
      this.legendarray.push(obj);
      i++;
    }
  }

  formLegendData() {
    this.legendData = [];
    this.legendarray.forEach(element => {
      let legendobject = {};
      legendobject['label'] = element.label;
      legendobject['color'] = element.color;
      this.legendData.push(legendobject);
    });
  }


}
