
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { CommanDataService } from '../services/comman.data.service'
import { DeviceQueryService } from '../services/device.query.service';
import * as d3 from 'd3';
@Component({
  selector: 'amexio-d3-chart-multiseries',
  templateUrl: './groupbar.component.html',
  styleUrls: ['./groupbar.component.css']
})
export class GroupbarComponent extends AmexioD3BaseChartComponent implements OnInit {

  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
  @ViewChild('drillid') drillid: any;
  @Input('data') data: any
  @Input() legend: boolean = true;
  @Input() barwidth: number = 0;
  @Output() onLegendClick: any = new EventEmitter<any>();
  @Input('width') svgwidth: number;
  @Input('height') svgheight: number = 300;
  @Input('yaxis-interval') tickscount: number;
  @Input('show-zero-values') showzeroflag: boolean = true;
  groupbarchartArray: any[] = [];
  legendArray: any;
  xaxisData: any;
  keyArray: any;
  legends: any;
  years: any;
  urllegendArray = [];
  svg: any;
  wt: any;
  defualtColors: any = [];
  constructor(private myservice: CommanDataService, private cdf: ChangeDetectorRef, private device: DeviceQueryService) {
    super('multibar');
    this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
  }

  ngOnInit() {
    this.wt = this.svgwidth;
    if (this.level <= 1) {
      let res: any;
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          res = response;

        }, (error) => {
        }, () => {
          setTimeout(() => {

            this.data = this.getResponseData(res);
            this.initializeData();
            this.plotD3Chart();
          }, 0);

        });

      } else if (this.data) {


        setTimeout(() => {
          this.data = this.getResponseData(this.data);
          this.initializeData();
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

  plotD3Chart(): void {
    this.convertToJSON();
    this.plotGroupBarChart();
    this.transformData(this.data);
  }

  private plotGroupBarChart(): void {
    const tooltip = this.toolTip(d3);
    this.defualtColors = this.predefinedcolors;
    // this.svgwidth = this.chartId.nativeElement.offsetWidth;
    if (this.resizeflag == false) {
      //RESIZE STEP 1
      if (this.wt) {
        this.svgwidth = this.wt;

      } else if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;

      }
      //RESIZE STEP 1 ENDS HERE 
    }
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = this.svgwidth - margin.left - margin.right;
    const height = this.svgheight - margin.top - margin.bottom;

    this.svg = d3.select("#" + this.componentId)
      .attr('viewBox', '0 0 ' + this.svgwidth + ' ' + this.svgheight)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .padding(0.2);

    const x1 = d3.scaleBand().padding(0.1);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    //setting x and y domains
    this.years = this.groupbarchartArray.map((d) => { return d.labels; });
    let label = this.groupbarchartArray[0].values.map((d) => { return d.label; });

    x0.domain(this.years);
    x1.domain(label).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(this.groupbarchartArray, (labels) => { return d3.max(labels.values, (d) => { return d.value; }); })]);

    //dynamic barwidth
    if (this.barwidth > 0) {
      this.barwidth = this.barwidth;
    }
    else {
      this.barwidth = x0.bandwidth;
    }

    // add x axis to svg



    if (this.device.IsDesktop() == true) {
      if (this.svgwidth <= 400) {
        this.svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x0)).
          selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(60)")
          .style("text-anchor", "start");
      } else {
        this.svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x0))
      }
    }
    else {
      this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0)).
        selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(60)")
        .style("text-anchor", "start");

    }



    //add y axis to svg
    this.svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(10).ticks(this.tickscount))

    this.plotLine(this.svg, y, height, width);

    // svg.select('.y').transition().duration(500).delay(1300).style('opacity', '1');
    //adding bars
 
    let slice = this.svg.selectAll(".slice")
      .data(this.groupbarchartArray)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", (d) => { 
         let flag = false;
        (d.values).forEach((element,index) => {
          //splice 0 
          if(element.value && (element.value < 1)) {
          d.values.splice(0,index);
          } 
        });
        return "translate(" + x0(d.labels) + ",0)"; });

     slice.selectAll("rect")
      .data((d) => { return d.values; })
      .enter().
      append("rect")
      .attr("width", x1.bandwidth
    )
      .attr("x", (d) => {
        return x1(d.label)
      })
      .style("fill", (d, index) => {
        if (this.colors.length > 0) {
          if (this.colors[index]) {
            return this.colors[index];
          }
          else {
            return this.defualtColors[index];
          }
        }
        else {
          return this.defualtColors[index];
        }
       })
      .attr("y", (d) => { return y(0); })
      .attr("height", (d) => { return height - y(0); })
      .attr("cursor", "pointer")
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        return tooltip.html(
          this.setKey(d))
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      }).on("mouseout", (d) => {
        return tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.groupbarClick(d);
        this.fordrillableClick(this, d, event);
        return tooltip.style("visibility", "hidden");
       })

    // -------------------------------------------------------
    if (this.labelflag) {
      slice.selectAll("text")
        .data((d) => { return d.values; })
        .enter().append("text")
        .attr("width", x1.bandwidth)
        .attr("x", (d) => {
          return x1(d.label) + x1.bandwidth() / 2
        })
        .attr("y", (d) => { return y(d.value); })
        .attr("height", (d) => { return height - y(0); })
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
        .text((d) => {
          // if((d.value > 0) ) {
          // return d.value;
          // }
          if(this.showzeroflag) {
          return d.value;
          }
          else if(!this.showzeroflag) {
            if(d.value > 0) {
              return d.value;
            }
          }
        })
        .attr("cursor", "pointer")
        .on("mouseover", (d) => {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", (d) => {
          return tooltip.html(
            this.setKey(d)
            //  this.toolTipContent(d)
          )
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        }).on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
        .on("click", (d) => {
          this.groupbarClick(d);
          this.fordrillableClick(this, d, event);
          return tooltip.style("visibility", "hidden");
          // this.chartClick(d);
        })
    }
    slice.selectAll("rect")
      .attr("y", (d) => {
        return y(d.value);
      })
      .attr("height", (d) => { return height - y(d.value); });
  }

  groupbarClick(d: any) {
    let object = {};
    object[d.label] = d.value;
    object[this.xaxisData] = d.xaxis;
    this.chartClick(object);
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
    this.plotGroupBarChart();
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

  //2d array to json conversion
  convertToJSON() {
    let groupChartObj = { "labels": "", values: [] };
    let firstRowOfData = this.data[0];
    this.xaxisData = this.data[0][0];

    for (let i = 1; i < this.data.length; i++) {
      let multiSeriesArray = [];
      let valueOfJ: any;

      for (let j = 1; j < this.data[i].length; j++) {

        valueOfJ = this.data[i][0];
        let singleBarObj = {};
        singleBarObj["value"] = this.data[i][j];
        singleBarObj["label"] = firstRowOfData[j];
        singleBarObj["xaxis"] = this.data[i][0];
        multiSeriesArray.push(singleBarObj);
      }
      if (multiSeriesArray.length) {
        groupChartObj["values"] = multiSeriesArray;
        let newLabelsValues: any = valueOfJ;
        let newGroupDataObj = Object.assign({}, groupChartObj);
        newGroupDataObj['labels'] = newLabelsValues + '';
        this.groupbarchartArray.push(newGroupDataObj);
      }
    }

  }


  transformto2dArray() {
    let i = 0
    let result = [];
    result.push("years");
    this.data.forEach((element, i) => {
      if (i == 0) {
        element.values.forEach(element2 => {
          result.push(element2.label);

        });
      }

    });
    this.urllegendArray.push(result);

    let temparray = [];
    this.data.forEach(element => {
      temparray = [];
      let values: any;
      let year = element.labels;
      temparray.push(year);
      element.values.forEach(element2 => {
        values = element2.value;
        temparray.push(values);
      });
      this.urllegendArray.push(temparray);
    })
  }

  transformData(data: any) {
    this.keyArray = [];
    this.legendArray = [];
    data.forEach((element, i) => {
      if (i == 0) {
        element.forEach((innerelement, index) => {
          if (index > 0) {
            this.legendArray[innerelement] = { 'data': [] };
            this.keyArray.push(innerelement);
          }
        });
      }
    });
    data.forEach((element, index) => {
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
      }
    });

    this.legends = [];
    this.keyArray.forEach((element, index) => {
      const legenddata = this.legendArray[element];
      let object;
      if (this.colors.length > 0) {
        object = { 'label': element, 'color': this.colors[index], 'data': legenddata.data };
       } else {
         object = { 'label': element, 'color': this.predefinedcolors[index], 'data': legenddata.data };
       }
      this.legends.push(object);
    });
  }

  setKey(d: any) {
    let object = {};
    object[d.label] = d.value;
    object[this.xaxisData] = d.xaxis;
    return (this.toolTipForBar(object));
  }

  plotLine(g, y, height, width) {
    if (this.hScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat('').ticks(this.tickscount));
    }
  }

}
