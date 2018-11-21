import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from '../base/base.component';
import { PlotCart } from '../base/chart.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommanDataService } from '../services/comman.data.service';

@Component({
  selector: 'amexio-d3-chart-donut',
  templateUrl: './dounut.component.html'
})
export class AmexioD3DounutChartComponent extends AmexioD3BaseChartComponent implements PlotCart {
  @Input('pie') pie: boolean = false;
  @Input('width') svgwidth: number = 300;
  @Input('height') svgheight: number = 300;
  @ViewChild('chartId') chartId: ElementRef;
  @ViewChild('drillid') drillid: any;
  @Input('data-reader') datareader: string;
  @Input('level') level:number=0 ;
  @Input('target') target:number;
  @Input() drillData: any;
  @Input('drillable-data') drillabledatakey:any
  drillableFlag:boolean = true;
  keyArray: any[] = [];
  transformeddata: any[] = [];
  legendArray:any[] = [];
  response:any;
  constructor(private myservice: CommanDataService) {
    super('DONUTCHART');
  }

  ngOnInit() {
  
    if(this.level<=1)
    {
       let resp:any;
    if (this.httpmethod && this.httpurl) {
      this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
        resp = response;
      }, (error) => {
      }, () => {
        
        setTimeout(() => {
        
          this.data= this.getResponseData(resp);
          this.drawChart();

          this.data = this.getResponseData(resp);
          //this.transformData(this.data);
          this.initializeData();
          this.plotD3Chart();
        }, 0);
      });
    
    } else
      if (this.data) {

      
      setTimeout(() => {
          this.data= this.getResponseData(this.data);
          this.transformData(this.data); 
          this.initializeData();
          this.plotD3Chart();
        }, 0);
      } 
    }   else {
               
                this.fetchData(this.drillData);
               
    }  
  }


  fetchData(data:any)
  {   

    let requestJson;
    let key=this.drillabledatakey;
    let resp: any;

    if(this.drillabledatakey.length)
    {
         let drillabledata= this.getMultipleDrillbleKeyData(data,key);
         requestJson=drillabledata;
     }
    else{
            requestJson=data;
        }
  
          if (this.httpmethod && this.httpurl) {
              this.myservice.postfetchData(this.httpurl, this.httpmethod,requestJson).subscribe((response) => {
                  resp = response;
                  this.response=resp;
              }, (error) => {
              }, () => {
                  setTimeout(() => {
                       this.data = this.getResponseData(resp);
                       
                       this.drawChart();
                      
                  }, 0);
            });
  
          }
  }
  
  drawChart()
  {
   setTimeout(() => {
   this.drillableFlag=true;
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
    const outerRadius = (this.svgwidth) / 2;
    let innerRadius = (this.svgwidth) / 4;
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
        });

    const svg = d3.select("#" + this.componentId)
      .append('g')
      .attr('transform', 'translate(' + this.svgwidth / 2 + ',' + this.svgheight / 2 + ')')
      .selectAll('path')
      .data(pie(this.data))
      .enter();

    const path = svg.append('path')
      .attr('d', arc)
      .attr('fill',  (d, i) => {
         if(d.data.color){
          return d.data.color;
        }
        else {
          return "black";
        }
       })
      .attr('cursor', 'pointer')
      .on("mouseover", (d) => {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", (d) => {
        return tooltip.html(
          this.formTooltipData(d.data)
        )
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", (d) => {
        return tooltip.style("visibility", "hidden");
      })
      .on("click", (d) => {
        this.DonutChartClick(d.data);
        this.fordrillableClick(this,d.data,event);
        return tooltip.style("visibility", "hidden");
       })
       svg.append('g').classed('labels',true);
       svg.append('g').classed('lines',true);
        var outerArc = d3.arc()
       //orignally multiplication value was 0.9
       //this value can be hardcoded as its multiple get multiplied 
      //  with calculated radius tht can be anything
       .outerRadius(innerRadius * 1.5)
       .innerRadius(outerRadius * 1.5);
 var polyline = svg.select('.lines')
                .selectAll('polyline')
                .data(pie(this.data))
              .enter().append('polyline')
              .attr('class', 'polyline')
                .attr('points', (d)=> {
                     // see label transform function for explanations of these three lines.
                    var pos = outerArc.centroid(d);
                    pos[0] = outerRadius * 1.1 * (this.midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                })
                .attr('fill','none')
                .attr('stroke','#A0A0A0')
                .attr("stroke-width", 1.0);

                var label = svg.select('.labels').selectAll('text')
                .data(pie(this.data))
              .enter().append('text')
                .attr('dy', '.35em')
                 .html((d)=> {
                    return d.data[Object.keys(d.data)[1]];
                })
                .attr('transform', (d)=> {
                    var pos = outerArc.centroid(d);
                    pos[0] = outerRadius * 1.11 * (this.midAngle(d) < Math.PI ? 1 : -1);
                    
                    return 'translate(' + pos + ')';
                })
                .style('text-anchor', (d)=> {
                    return (this.midAngle(d)) < Math.PI ? 'start' : 'end';
                });
  }

  
  midAngle(d: any) { return d.startAngle + (d.endAngle - d.startAngle) / 2; } 


  formLegendData(){
    this.legendArray=[];
    this.data.forEach(element => {
        let legendobject = {};
        legendobject['label'] = element[Object.keys(element)[0]];
        legendobject['value'] = element[Object.keys(element)[1]];
        legendobject['color'] = element.color;
        this.legendArray.push(legendobject);
    });
     }

    onDonutLegendClick(legendevent: any){
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
   if(key != 'color' && key != 'textcolor'){
      object[key] = value;
  }
  }
  return this.toolTipForBar(object);
}

DonutChartClick(event: any){
  let object = {};
for (let [key, value] of Object.entries(event)) {
 if(key != 'color'){
    object[key] = value;
}
}
  this.chartClick(object);
}
   resize() {
  }
}
