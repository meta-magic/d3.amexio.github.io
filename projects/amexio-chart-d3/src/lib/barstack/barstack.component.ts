import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';

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
  @Input('data') data1: any
  @Input() barwidth: number = 0;
  @Input() title: String = "";
  @Input() legend: boolean = true;
  @Input() color: string[] = [];
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @ViewChild('chartId') chartId: ElementRef;
  @Output() onLegendClick: any = new EventEmitter<any>();

  constructor() {
    super('barstack');
  }

  ngOnInit() {
    this.transformData(this.data1);
    setTimeout(() => {
      this.plotChart();
    }, 0);
  }

  transformData(data1: any) {
    this.keyArray = [];
    this.legendArray = [];
    this.data1.forEach((element, i) => {
      if (i == 0) {
        element.forEach((innerelement, index) => {
          if (index > 0) {
            this.legendArray[innerelement] = { 'data': [] };
            this.keyArray.push(innerelement);
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
      let object = { 'label': element, 'color': this.predefinedcolors[index], 'data': legenddata.data };
      this.legends.push(object);
    });
  }

  plotChart() {
    const tooltip = this.toolTip(d3);
    let margin = { top: 20, right: 30, bottom: 30, left: 60 };
    let colors = this.predefinedcolors;
    this.svgwidth = this.chartId.nativeElement.offsetWidth;
    let data;

    data = this.data;

    let series = d3.stack()
      .keys(this.keyArray)
      .offset(d3.stackOffsetDiverging)
      (this.data);

    let svg = d3.select("#" + this.componentId),
      width = +this.svgwidth - margin.left - margin.right,
      height = +svg.attr("height");

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
        else{
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
      .attr("y", (d) => { return y(d[1]); })
      .attr("cursor", "pointer")
      .attr("height", (d) => { return y(d[0]) - y(d[1]); })
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
    const legendNode = JSON.parse(JSON.stringify(event));
    delete legendNode.color;
    this.onLegendClick.emit(legendNode);
  }

  setKey(d: any) {
    let diff = d[0] - d[1];
    if (diff < 0) {
      diff = (diff * (-1));
    }
    for (let [key, value] of Object.entries(d.data)) {
      if (value == diff) {
        let object = { 'label': key, 'value': value };
        return (this.toolTipContent(object));
      }
    }
  }

  setBarClickText(d: any) {
    let diff = d[0] - d[1];
    if (diff < 0) {
      diff = (diff * (-1));
    }
    for (let [key, value] of Object.entries(d.data)) {
      if (value == diff) {
        let object = { 'label': key, 'value': value };
        this.chartClick(object);
        //return (this.toolTipContent(object));
      }
    }
  }
  // barStackChartClick(d: any){
  //   let obj = {'label': }
  //   this.chartClick(d);

  // }
}
