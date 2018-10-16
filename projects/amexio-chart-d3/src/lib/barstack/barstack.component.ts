import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { CommanDataService } from '../services/comman.data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'amexio-d3-chart-barstack',
  templateUrl: './barstack.component.html',
  styleUrls: ['./barstack.component.css']
})
export class BarstackComponent extends AmexioD3BaseChartComponent implements OnInit {
  legendArray: any[];
  keyArray: any[];
  predefinedcolors: any[];
  legends: any[];
  charttype: string;
  data: any[];
  datareaderdata: any[];
  xaxis: any;
  @Input('data') data1: any
  @Input() barwidth: number = 0;
  @Input() title: String = "";
  @Input() legend: boolean = true;
  @Input() color: string[] = [];
  @Input('width') svgwidth: number = 300;
  @Input('data-reader') datareader: any;
  @Input('height') svgheight: number = 300;
  @ViewChild('chartId') chartId: ElementRef;
  @Output() onLegendClick: any = new EventEmitter<any>();

  constructor(private myservice: CommanDataService) {
    super('barstack');
  }

  ngOnInit() {
    // this.transformData(this.data1);
    // setTimeout(() => {
    //   this.plotChart();
    // }, 0);
    let res;
    if (this.httpmethod && this.httpurl) {
      this.myservice.fetchData(this.httpurl, this.httpmethod).subscribe((response) => {
        //this.data = response;
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
    let margin = { top: 20, right: 30, bottom: 30, left: 60 };
    let colors = this.predefinedcolors;
    this.svgwidth = this.chartId.nativeElement.offsetWidth;
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
    series
    let svg = d3.select("#" + this.componentId),
      width = this.svgwidth - margin.left - margin.right;

    let height = +svg.attr("height");

    let x = d3.scaleBand()
      .domain(data.map((d) => {
        return d[Object.keys(d)[0]];
      }))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    let y = d3.scaleLinear()
      .domain([d3.min(this.stackMin(series)), d3.max(this.stackMax(series))])
      .rangeRound([height - margin.bottom, margin.top]);
    let z = d3.scaleOrdinal(d3.schemeCategory10);
    if (this.barwidth > 0) {
      this.barwidth = this.barwidth;
    }
    else {
      this.barwidth = x.bandwidth;
    }

    svg.append("g")
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
      .data((d) => { return d; })
      .enter().append("rect")
      .attr("width", x.bandwidth).attr('id', (d, i) => {
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
        // this.chartClick(d);
      });

    svg.append("g")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x));

    svg.append("g")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
  }

  stackMin(serie) {
    return d3.min(serie, function (d) { return d[0]; });
  }

  stackMax(serie) {
    return d3.max(serie, function (d) { return d[1]; });
  }

  resize() {
  }

  legendClick(event: any) {
    // debugger;
    // const legendNode = JSON.parse(JSON.stringify(event));
    // delete legendNode.color;
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
    //this.onLegendClick.emit(legendNode);
  }

  setKey(d: any) {
    let diff = d[0] - d[1];
    if (diff < 0) {
      diff = (diff * (-1));
    }
    for (let [key, value] of Object.entries(d.data)) {
      if (value == diff) {
        //  let object = { 'label': key, 'value': value , 'legend': d.data[Object.keys(d.data)[0]]};
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
