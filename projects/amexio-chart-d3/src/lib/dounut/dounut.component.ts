import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { PlotCart } from '../base/chart.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommanDataService } from '../services/comman.data.service';
import { DeviceQueryService } from '../services/device.query.service';

@Component({
  selector: 'amexio-d3-chart-donut',
  templateUrl: './dounut.component.html',
  styleUrls: ['./donut.component.css']
})
export class AmexioD3DounutChartComponent extends AmexioD3BaseChartComponent implements PlotCart {

  @Input('pie') pie: boolean = false;
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
  @ViewChild('drillid') drillid: any;
  desktoplegend: boolean = false;
  mobilelegend: boolean = false;
  @Input() drillData: any;
  keyArray: any[] = [];
  transformeddata: any[] = [];
  legendArray: any[] = [];
  response: any;
  svg: any;
  constructor(private myservice: CommanDataService, private cdf: ChangeDetectorRef, private device: DeviceQueryService) {
    super('DONUTCHART');
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

            // this.data = this.getResponseData(resp);
            this.transformData(this.data);
            this.initializeData();
            this.plotD3Chart();
          }, 0);
        });

      } else
        if (this.data) {


          setTimeout(() => {
            this.data = this.getResponseData(this.data);
            this.transformData(this.data);
            this.initializeData();
            this.plotD3Chart();
          }, 0);
        }
    } else {

      this.fetchData(this.drillData);
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
        this.response = resp;
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
      this.drillableFlag = true;
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
    //this.transformData(this.data);
    //  this.data = this.transformeddata;
    let outerRadius = 0;
    let innerRadius = 0;

    outerRadius = this.svgwidth / 2;
    innerRadius = this.svgwidth / 4;

    if (this.pie) {
      innerRadius = 0;
    }

    const tooltip = this.toolTip(d3);

    const arc = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius);

    const pie = d3.pie()
      .value((d) => {
        return d[Object.keys(d)[1]];
        //  return d.value
      });

    this.svg = d3.select("#" + this.componentId)
      .append('g')
      .attr('transform', 'translate(' + this.svgwidth / 2 + ',' + this.svgheight / 2 + ')')
      .selectAll('path')
      .data(pie(this.data))
      .enter();

    if (this.device.IsDesktop() == true) {
      this.desktoplegend = true;
      this.mobilelegend = false;
    }
    // else{
    //        if(this.device.IsPhone()==true && this.device.IsTablet()==true)
    //        {
    //             this.desktoplegend=false;
    //             this.mobilelegend=true;
    //        }
    // }

    const path = this.svg.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => {
        if (d.data.color) {
          return d.data.color;
        }
        else {
          return "black";
        }
        //  return (d && d.data && d.data.color) ? d.data.color : "black"
      })
      .attr('cursor', 'pointer')
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        return tooltip.html(
          this.formTooltipData(d.data)

          //  this.formLegendData(d.data)
          // this.toolTipContent(d.data)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.DonutChartClick(d.data);
        this.fordrillableClick(this, d.data, event);
        return tooltip.style("visibility", "hidden");
        //this.chartClick(d.data);
      });
    if (this.labelflag) {
      const text = this.svg.append("text")
        .transition()
        .duration(200)
        .attr("transform", (d) => {
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text((d) => {

          return d.data[Object.keys(d.data)[1]]

          //return d.data.value;
        })
        .style('fill', (d) => {
          if (this.labelcolor && this.labelcolor.length > 0) {
            return this.labelcolor;
          } else {
            return "black";
          }
          // return (d && d.data && d.data.textcolor) ? d.data.textcolor : "black";
        })
        .style('font-size', '12px');
    }
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

  onDonutLegendClick(legendevent: any) {
    let obj = {};

    //  obj['label'] = legendevent.label;
    //  obj['value'] = legendevent.value 
    obj[this.keyArray[0]] = legendevent.label;
    obj[this.keyArray[1]] = legendevent.value;
    //delete event.color;
    this.legendClick(obj);
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

  formTooltipData(tooltipData: any) {
    let object = {};
    for (let [key, value] of Object.entries(tooltipData)) {
      if (key != 'color' && key != 'textcolor') {
        object[key] = value;
      }
    }
    return this.toolTipForBar(object);
  }

  DonutChartClick(event: any) {
    let object = {};
    for (let [key, value] of Object.entries(event)) {
      if (key != 'color') {
        object[key] = value;
      }
    }
    this.chartClick(object);
  }

  resize(data: any) {

    this.desktoplegend = false;
    this.mobilelegend = true;
    this.plotD3Chart();

  }

}
