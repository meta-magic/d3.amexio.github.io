import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { CommanDataService } from '../services/comman.data.service';

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
  @Input('data-reader') datareader: string;
  @Input('level') level: number = 0;
  @Input('target') target: number;
  @Input('drillable-data') drillabledatakey: any[] = [];
  @Input('horizontal-scale') hScale: boolean = true;
  @Input('vertical-scale') vScale: boolean = true;
  drillableFlag: boolean = true;
  keyArray: any[] = [];
  transformeddata: any[] = [];
  data: any;
  legends: any[];
  httpresponse: any;
  constructor(private myservice: CommanDataService) {
    super('scatter');
  }

  ngOnInit() {

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
            this.legendCreation();
            this.transformData(this.data);
            this.plotScatterChart();
          }, 0);
        });

      } else if (this.data) {

        setTimeout(() => {
          this.data = this.getResponseData(this.data);
          this.legendCreation();
          this.transformData(this.data);
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
      this.legendCreation();
      this.transformData(this.data);
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
    if (this.chartId) {
      this.svgwidth = this.chartId.nativeElement.offsetWidth;
    } else {

      this.svgwidth = this.svgwidth;
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

    let svg = d3.select("#" + this.componentId)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain([0, d3.max(this.data, function (d) { return d[Object.keys(d)[0]] })]);
    y.domain([0, d3.max(this.data, function (d) { return d[Object.keys(d)[1]] })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")

    this.plotLine(svg, x, y, height, width);

    svg.selectAll(".dot")
      .data(this.data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4.5)
      .attr("cursor", "pointer")
      .attr("cx", function (d) {
        return x(d[Object.keys(d)[0]]);
      })
      .attr("cy", function (d) { return y(d[Object.keys(d)[1]]); })
      .attr("fill", this.color)

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
      });
  }

  // Method to form tooltip data
  formTooltipData(tooltipData: any) {
    let object = {};
    for (let [key, value] of Object.entries(tooltipData)) {
      object[key] = value;
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
    this.legends = [];
    let element = this.data[0];
    let object = { 'label': element[0] + " " + "vs" + " " + element[1], 'color': this.color };
    this.legends.push(object);
  }

  // Method on Legend Click
  onScatterLegendClick(legendevent: any) {
    this.onLegendClick.emit(this.data);
  }

  // Method for responsiveness
  resize() {

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
}
