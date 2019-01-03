import { Component, Input, ViewChild, ElementRef, } from "@angular/core";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { CommanDataService } from '../services/comman.data.service';
import * as d3 from 'd3';
import { stringify } from "@angular/core/src/render3/util";
import { DeviceQueryService } from '../services/device.query.service';
@Component({
  selector: 'amexio-d3-combochart',
  templateUrl: './combochart.component.html',
  styleUrls: ['./combochart.component.css']
})
export class CombochartComponent extends AmexioD3BaseChartComponent implements PlotCart {
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @Input('line-color') lineColor: string = "black";
  @Input() label: boolean = false;
  @Input() horizontal: boolean = false;
  @Input() barwidth: number = 0;
  //   @Input('line-data-index') lineInput: any;
  @Input('line-data-index') lineInput: any[] = [];
  @Input('bar-data-index') barInput: any[] = [];

  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('divid') divid: ElementRef;
  simpleComboFlag: boolean = false;
  completeconverteddata: any[] = [];
  simpleCombodata: any[] = [];
  firstrow: any[];
  years: any;
  data: any;
  svg: any;
  totalColumns: number;
  groupbarchartArray: any[] = [];
  highercolorindex: number = 0;
  legendcolorindex: any;
  xaxisData: any;
  colorflag: boolean = false;
  keyArray: any[] = [];
  transformeddata: any[] = [];
  object: any;
  legendArray: any[] = [];
  httpresponse: any;
  offsetheight: any;
  lineRange: any;
  legends: any[] = [];

  totalcolumns
  sc1: boolean;
  sc2: boolean;
  sc2barflag: boolean;
  sc3: boolean;
  sc4: boolean;
  LineArray: any = [];
  outputData: any = [];
  lineflag: boolean;
  higherdot1colorindex = 0;

  constructor(private myservice: CommanDataService, private device: DeviceQueryService) {
    super('combochart');
  }

  ngOnInit() {

    if (this.level <= 1) {
      let resp: any;
      if (this.httpmethod && this.httpurl) {
        this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
          resp = response;
          this.httpresponse = response;
        }, (error) => {
        }, () => {
          setTimeout(() => {
            this.data = this.getResponseData(resp);
            this.transformData()
            this.initializeData();
            this.plotD3Chart();
          }, 0);
        });

      } else if (this.data) {
        setTimeout(() => {
          this.data = this.getResponseData(this.data);
          this.transformData()
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
        this.httpresponse = response;
      }, (error) => {
      }, () => {
        setTimeout(() => {
          // this.data = this.getResponseData(resp);
          this.drawChart();
        }, 0);
      });
    }
  }

  drawChart() {
    setTimeout(() => {
      this.data = this.getResponseData(this.httpresponse);
      this.transformData()
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

  transformData() {
    this.formDatastructure();
    this.tranasforsimplejson();
  }

  formDatastructure() {

    // for line
    //call createjson() for complete data for line
    this.lineflag = true;
    this.createjson(this.data);

    //validate scenarios
    //validate scenario1: bar + line + data
    if ((this.barInput.length > 0) && (this.lineInput.length > 0) &&
      (this.data[0].length > 2)) {
      this.sc1 = true;
      this.createData1(this.barInput, this.data);
    }
    //validate scenario2: line + data
    //validate scenario2.1 line + data columns only two then only line will be plot
    else if ((this.lineInput.length > 0) &&
      //##get it checked
      (this.data[0].length > 1)) {
      this.sc2 = true;
      //decide whether only line will be plot or bar also

      //chk if data[0] has any extra column leaving lineinput array
      let barflag: boolean;
      //if so set sc2barflag
      this.data[0].forEach(column => {
        this.lineInput.forEach(linename => {
          if (column !== linename) {
            this.sc2barflag = true;
            // u can plot bar now
          }
        });
      });

      this.createData1(null, this.data);

      //chk if sc2barflag is set or reset
      if (this.sc2barflag == true) {
        //plot bar  + line

      } else {
        // plot only line
      }

    }//else if of sc2 ends

    //validate scenario3: bar + data
    else if ((this.barInput.length > 0) && (this.data[0].length > 1)) {
      this.sc3 = true;
      this.createData1(this.barInput, this.data);
    }

    //validate scenario4: data
    else if ((this.barInput.length < 1) && (this.lineInput.length < 1) && this.data[0].length > 1) {
      this.sc4 = true;
      this.createData1(null, this.data);
    }
  }

  createData1(inpdata: any[], fulldata: any[]) {
    let linearr = [];
    this.lineInput.forEach(element => {
      linearr.push(element.column);
    });
    this.firstrow = this.data[0]

    let dummyArray = [];
    dummyArray.push(0);
    fulldata.forEach((record: any[], index: any) => {
      if (index === 0) {
        // THIS LOGIC IS USED FOR FINDING INDEXS AND ADD INTO dummyArray ARRAY
        record.forEach((innerObject: any, innerIndex: any) => {
          //validates scenario1 and 3
          if (this.sc1 == true || this.sc3 == true) {
            this.barInput.forEach((elementOfInputData: any) => {
              //aja
              if (innerObject === elementOfInputData.column) {
                //dummyarray has index stack
                dummyArray.push(innerIndex);
              }
            });
          }//sc1 and sc3 validation done
          //validates scenario 2
          if (this.sc2 == true) {

            if (this.sc2barflag == true) {

              this.lineInput.forEach((elementOfLineData: any) => {

                if ((innerObject !== elementOfLineData.column) && (innerIndex !== 0)) {
                  //dummyarray has index stack
                  // dummyArray.forEach(dummyelement => {

                  //   if(dummyelement !== innerIndex) {
                  // if ( (linearr.includes(innerObject) == false)) {
                  linearr.includes(innerObject);
                  if (linearr.includes(innerObject) == false) {
                    if (dummyArray.includes(innerIndex)) {

                    } else {
                      dummyArray.push(innerIndex);
                      return;
                    }
                  }  // }
                  //   }
                  // });
                }
              });
            }
          }
        });
        //validates scenario 4
        if (this.sc4 == true) {
          // chk if barflag is set
          let columns = this.data[0].length;
          if (columns > 1) {
            dummyArray.push(1);
          }
        }

        // dummyArray.push(0);
        let firstArray = [];
        // FOR FIRST RECORD
        dummyArray.forEach((object: any, dummyIndex: any) => {
          firstArray.push(record[object]);
        });
        this.outputData.push(firstArray);

      } else {
        let newData = [];
        record.forEach((innerObject: any, innerIndex: any) => {
          dummyArray.forEach((object: any, dummyIndex: any) => {
            if (innerIndex === object) {
              newData.push(innerObject);
            }
          });
        });
        this.outputData.push(newData);
      }
    });

    this.createjson(this.outputData);
    // this.formLegendData(this.outputData);
  }

  createjson(arraydata: any[]) {
    let groupChartObj = { "labels": "", values: [] };

    this.groupbarchartArray = [];
    let firstRowOfData = arraydata[0];
    this.xaxisData = this.data[0][0];

    for (let i = 1; i < arraydata.length; i++) {
      let multiSeriesArray = [];
      let valueOfJ: any;
      for (let j = 1; j < arraydata[i].length; j++) {
        valueOfJ = arraydata[i][0];
        let singleBarObj = {};
        singleBarObj["value"] = arraydata[i][j];
        singleBarObj["label"] = firstRowOfData[j];
        singleBarObj["xaxis"] = arraydata[i][0];
        singleBarObj;
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
    if (this.lineflag) {

      this.groupbarchartArray;

      this.LineArray = this.groupbarchartArray;
    }

    else {
      this.groupbarchartArray = [];

      let firstRowOfData = arraydata[0];
      // this.xaxisData = this.data[0][0];

      for (let i = 1; i < arraydata.length; i++) {
        let multiSeriesArray = [];
        let valueOfJ: any;
        for (let j = 1; j < arraydata[i].length; j++) {
          valueOfJ = arraydata[i][0];
          let singleBarObj = {};
          singleBarObj["value"] = arraydata[i][j];
          singleBarObj["label"] = firstRowOfData[j];
          singleBarObj["xaxis"] = arraydata[i][0];
          singleBarObj;
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
      this.groupbarchartArray;
    }

  }

  plotD3Chart() {
    //plot multiseries chart
    const tooltip = this.toolTip(d3);
    let colors = this.predefinedcolors;
    if (this.resizeflag == false) {
      if (this.chartId) {
        this.svgwidth = this.chartId.nativeElement.offsetWidth;
      } else {
        this.svgwidth = this.svgwidth;
      }
    }
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = this.svgwidth - margin.left - margin.right;
    const height = this.svgheight - margin.top - margin.bottom;

    this.svg = d3.select("#" + this.componentId)
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
      this.svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
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
        .ticks(10))

    this.plotLineForMultiSeries(this.svg, y, height, width);
    //adding bars
    let slice = this.svg.selectAll(".slice")
      .data(this.groupbarchartArray)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", (d) => { return "translate(" + x0(d.labels) + ",0)"; });


    slice.selectAll("rect")
      .data((d) => { return d.values; })
      .enter().append("rect")
      .attr("width", x1.bandwidth)
      .attr("x", (d) => {
        return x1(d.label)
      })
      .style("fill", (d, index) => {
        this.higherdot1colorindex = index;
        this.legendcolorindex = index;
        return colors[index]
      })
      .attr("y", (d, ind) => { return y(d.value); })
      .attr("height", (d, ind) => {
        return height - y(d.value);
      })
      .attr("cursor", "pointer")
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        return tooltip.html(
          this.setKey(d)
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
      })

    // -------------------------------------------------------
    //bar label
    // if (this.labelflag) {
    slice.selectAll("text")
      .data((d) => { return d.values; })
      .enter().append("text")
      .attr("opacity",
        (d) => {
          let visibility: boolean = false;
          if (this.barInput.length > 0) {
            this.barInput.forEach((barname: any) => {
              if ((barname.column == d.label) && (barname.label == true)) {
                visibility = true;
                return;
              }
            });

            if (visibility) {
              return 1
            } else {
              return 0
            }
          }// outer if 
          // validation of scenario4
          else if ((this.sc4 == true) && (this.label == true)) {
            return 1
          }

          else {
            return 0;
          }
        }
      )
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
        if (this.labelcolor.length > 0) {
          return this.labelcolor;
        } else {
          return "black";
        }
      })
      .text((d) => {
        return d.value;
      });
    // }
    slice.selectAll("rect")
      .attr("y", (d) => {
        return y(d.value);
      })
      .attr("height", (d) => { return height - y(d.value); });

    // ------------------------------------------------------------------
    //sigle / multi line code starts here
    //code here fr multi line
    let i;
    // let lineName;
    let slice1 = this.svg.selectAll(".slice")
      .data(this.transformeddata)
      .enter().append("g")
      .attr("class", "g")
    this.higherdot1colorindex++
    this.lineInput.forEach(element => {
      if (element.color) {

      }
      else {
        element["color"] = colors[this.higherdot1colorindex];
        this.higherdot1colorindex++;
      }
    });

    //line validation for scenario 1 and 2
    if (this.lineInput.length > 0) {
      for (i = 0; i < this.lineInput.length; i++) {
        let colorincrementer = 1;
        let lineName = this.lineInput[i];
        let valueline = d3.line()
          .x((d) => {
            return x0(d[Object.keys(d)[0]]);
          })
          .y((d) => { return y(d[lineName.column]); });

        let shift = margin.left + x1.bandwidth() / 2;

        slice1.append("path")
          .data([this.transformeddata])
          .attr("fill", "none")
          .style("stroke",
            (d) => {
              if (lineName.color) {
                return lineName.color;
              }
            }
          )
          .attr("stroke-width", 1.5)
          .attr("transform", "translate( " + x1.bandwidth() / 2 + ", 0 )")
          .attr("d", valueline);
        // points1
        let dotslice = slice1.selectAll("dot")
          .data(this.transformeddata)
          .enter()

          .append("circle")
          // .merge(points1)
          .attr("class", "point1")
          .attr("cursor", "pointer")
          .style("fill",
            (d) => {
              if (lineName.color) {
                return lineName.color
              }

            }
          )
          .attr("cx", (d) => {
            return x0(d[Object.keys(d)[0]]);
          })
          .attr("cy", (d) => {
            return y(d[lineName.column]);
          })
          .attr("r", (d) => { return 5; })
          .attr("transform", "translate( " + x1.bandwidth() / 2 + ", 0 )")
          .on("mouseover", (d) => {
            return tooltip.style("visibility", "visible");
          })
          .on("mousemove", (d) => {
            return tooltip.html(
              this.formTooltipLineData(d, lineName, false))
              .style("top", (d3.event.pageY - 10) + "px")
              .style("left", (d3.event.pageX + 10) + "px");
          })
          .on("mouseout", (d) => {
            return tooltip.style("visibility", "hidden");
          })
          .on("click", (d) => {
            this.onComboLineClick(d, lineName, false);
            this.fordrillableClick(this, d, event);
            return tooltip.style("visibility", "hidden");
          });

        // }
        // 
      }// line code ends

    }//lineinput if condition ends here
    //scenario 4 validation for line assumption
    else if ((this.sc4 == true) && (this.data[0].length > 2)) {

      //  lineName = this.lineInput[i];
      let valueline = d3.line()
        // valueline.data(this.completeconverteddata)
        .x((d) => {
          return x0(d[Object.keys(d)[0]]);
          //  return x1(d[Object.keys(d)[0]]);
        })
        .y((d) => {
          return y(
            d[Object.keys(d)[2]]
            // d[lineName]
          );
        });

      let shift = margin.left + x1.bandwidth() / 2;
      slice1.append("path")
        .data([this.transformeddata])
        .attr("fill", "none")
        .style("stroke", (d) => {
          if (this.lineColor !== "black") {
            return this.lineColor;
          }
          else {
            return colors[2];
          }
        })
        .attr("stroke-width", 1.5)
        .attr("transform", "translate( " + x1.bandwidth() / 2 + ", 0 )")
        .attr("d", valueline);

      // points1
      slice1.selectAll("dot")
        .data(this.transformeddata).enter().append("circle")
        // .merge(points1)
        .attr("class", "point1")
        .attr("cursor", "pointer")
        .style("stroke", (d) => {
          if (this.lineColor !== "black") {
            return this.lineColor;
          }
          else {
            return colors[2];
          }
        })
        .style("fill", (d) => {
          if (this.lineColor !== "black") {
            return this.lineColor;
          }
          else {
            return colors[2]
          }
        })
        .attr("cx", (d) => {
          return x0(d[Object.keys(d)[0]]);
        })
        .attr("cy", (d) => {
          return y(
            d[Object.keys(d)[2]]
            // d[lineName]
          );
        })
        .attr("r", (d) => { return 5; })
        .attr("transform", "translate( " + x1.bandwidth() / 2 + ", 0 )")
        .on("mouseover", (d) => {
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", (d) => {
          return tooltip.html(
            this.formTooltipLineData(d, null, true))
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", (d) => {
          return tooltip.style("visibility", "hidden");
        })
        .on("click", (d) => {
          this.onComboLineClick(d, null, true);
          this.fordrillableClick(this, d, event);
          return tooltip.style("visibility", "hidden");
        })
    }

    //line label validation for scenario 1 and 2
    if (this.lineInput.length > 0) {
      //iteration on lineinput
      let labelpostoggle = false;
      for (i = 0; i < this.lineInput.length; i++) {
        let lineName1 = this.lineInput[i];
        if (lineName1.label) {
          if (lineName1.label == true) {
            slice1.selectAll("labels")
              .data(this.transformeddata)
              .enter().append("text")
              .style("font-weight", "bold")
              .attr("text-anchor", "middle")
              .attr("fill", (d) => {
                if (lineName1.labelcolor) {
                  return lineName1.labelcolor;
                } else {
                  return "black";
                }
              })
              .attr("x", (d) => {
                return x0(d[Object.keys(d)[0]]);
              })
              .attr("y", (d) => {
                return y(d[lineName1.column])

              })
              .text((d) => {
                return d[lineName1.column];
                // d[lineName];
              })
              .attr("transform", "translate( " +
                // margin.left
                x1.bandwidth() / 2
                // shift
                + ", 19 )")
          }
        }

      }

    }

    //line label validation for scenario 4
    else if ((this.sc4 == true) && (this.data[0].length > 2) && (this.label == true)) {
      //trial line label for 4th scenario
      slice1.selectAll("labels")
        .data(this.transformeddata)
        .enter().append("text")
        .style("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("fill", (d) => {
          if (this.labelcolor.length > 0) {
            return this.labelcolor;
          } else {
            return "black";
          }
        })
        .attr("x", (d) => {
          return x0(d[Object.keys(d)[0]]);
        })
        .attr("y", (d) => {

          return y(
            d[Object.keys(d)[2]]
            // d[lineName]
          )
          //  + 50;
        })
        .text((d) => {
          return d[Object.keys(d)[2]];
          // d[lineName];
        })
        .attr("transform", "translate( " +
          // margin.left
          x1.bandwidth() / 2
          // shift
          + ", 19 )")


    }

    this.formLegendData(this.outputData)
  }

  plotLine(g, x, y, height, width) {
    if (this.hScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat(''));
    }
  }

  setKey(d: any) {
    let object = {};
    object[d.label] = d.value;
    object[this.xaxisData] = d.xaxis;
    return (this.toolTipForBar(object));
  }

  finMaxLineValue() {
    let lineValues = [];
    this.data.forEach((element) => {
      for (let [key, value] of Object.entries(element)) {
        this.lineInput.forEach((line) => {
          if (line == key) {
            lineValues.push(value);
          }
        });
      }
    });

    let max = 0, j;

    for (j = 0; j < lineValues.length; j++) {
      if (lineValues[j] > max) {
        max = lineValues[j];
      }
    }
    this.lineRange = max;
  }

  groupbarClick(d: any) {
    let object = {};
    object[d.label] = d.value;
    object[this.xaxisData] = d.xaxis;
    this.chartClick(object);
  }

  plotLineForMultiSeries(g, y, height, width) {
    if (this.hScale) {
      g.append('g')
        .attr("color", "lightgrey")
        .call(d3.axisLeft(y)
          .tickSize(-width).tickFormat(''));
    }
  }

  resize() {
    this.svgwidth = 0;
    this.svg.selectAll("*").remove();
    this.resizeflag = true;
    this.svgwidth = this.divid.nativeElement.offsetWidth;
    this.plotD3Chart();
  }

  tranasforsimplejson() {
    this.transformeddata = [];
    this.keyArray = this.data[0];
    this.data.forEach((element, index) => {
      if (index > 0) {
        let DummyObject = {};
        element.forEach((individualvalue, keyindex) => {
          DummyObject[this.keyArray[keyindex]] = individualvalue;
        });//inner for loop ends
        this.transformeddata.push(DummyObject);
      }//if ends
    });//outer for loop ends
  }

  formTooltipLineData(data: any, line: any, flag: boolean) {
    let object = {};
    for (let [key, value] of Object.entries(data)) {
      //flag is considered true for forth scenario
      if (flag == true) {
        if (key == this.data[0][2]) {
          object[key] = value;
        }
      }// if foe true flag ends here
      else {
        if (key == line.column) {
          object[key] = value;
        }
      }//else for false flag ends here

    }


    return this.toolTipForBar(object);
  }

  onComboLineClick(data: any, line: any, flag: boolean) {
    // flag is considered true for 4th scenario
    let object = {};
    let i = 0;
    for (let [key, value] of Object.entries(data)) {
      if (i == 0 || i == 1) {
        if (key != "color") {
          object[key] = value;
        }
      }

      if (flag == true) {
        if (key == this.data[0][2]) {
          object[key] = value;
        }
      } else {
        if (key == line.column) {
          object[key] = value;
        }
      }

      i++;
    }
    //this calls base class function
    this.comboLineClick(object);
  }

  formLegendData(data: any) {
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
              legenddata.data.push({ 'label': element[0], 'value': element[innerindex] });
            }
          }

        });
      }
    });

    this.legends = [];
    this.keyArray.forEach((element, index) => {
      const legenddata = this.legendArray[element];
      let object = { 'label': element, 'color': this.predefinedcolors[index], 'data': legenddata.data };
      this.legends.push(object);
    });

    //this logic will wrk fr sc1 and sc2
    if (this.lineInput.length > 0) {
      let inc = 1;
      this.lineInput.forEach((element: any) => {
        let object = {};
        object["label"] = element.column;
        if (element.color) {
          object["color"] = element.color;
        }
        else {
          object["color"] = this.predefinedcolors[this.legendcolorindex + inc];
          inc++;
        }
        object["data"] = [];
        this.legends.push(object);
      });
      this.legends
      this.transformeddata;
      let tempdataarray = [];

      this.legends.forEach(legendelement => {
        this.lineInput.forEach(lineelement => {
          if (lineelement.column == legendelement.label) {
            this.transformeddata.forEach(singlerow => {
              let obj = {};
              // d[Object.keys(d)[0]]
              obj["label"] = singlerow[Object.keys(singlerow)[0]];
              obj["value"] = singlerow[legendelement.label];
              legendelement.data.push(obj);
            });
          }
        });
      });
    }

    //this logic works for sc4
    // chk if line column exist in data1
    if ((this.sc4 == true) && (this.data[0].length > 2)) {

      let object = [];
      object["label"] = this.data[0][2];
      object["color"] = this.predefinedcolors[2];
      object["data"] = [];
      this.legends.push(object);
      let temparray = [];
      //logic to push data
      this.data.forEach((element, index) => {
        if (index > 0) {
          let object = [];
          object["label"] = element[0];
          object["value"] = element[2];
          this.legends[1].data.push(object);
        }
      });
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
}
