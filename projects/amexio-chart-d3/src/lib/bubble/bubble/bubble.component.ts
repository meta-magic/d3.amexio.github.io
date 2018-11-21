import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AmexioD3BaseChartComponent } from '../../base/base.component';
import { CommanDataService } from '../../services/comman.data.service';
import * as d3 from 'd3';
@Component({
  selector: 'amexio-d3-chart-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css']
})
export class BubbleComponent  extends AmexioD3BaseChartComponent implements OnInit {
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
  colors:any[]=[];
  data1:any;
  xaxisArray:any[]=[];
  xarray:any[]=[];
  legends:any[]=[];
  legendarray:any[]=[];
  legendData:any[]=[];
  minxvalue:number=0;
  maxxvalue:number=0;
  colordata:any;
  bubblechartdata:any[]=[];
  httpresponse:any;
  constructor(private myservice: CommanDataService) {
 
    super('scatter');
    this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];

   }

  ngOnInit() {

    this.data1=[];

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
            this.data1=this.data;
            
            this.xaxisData();
            this.transformData(this.data1);
            this.transformdata();
            this.colorGeneration();
            this.formLegendData();
            this. plotBubbleChart();
          }, 0);
        });

      } else if (this.data) {

        setTimeout(() => {
          this.data1=this.data;
          this.data = this.getResponseData(this.data);
          this.xaxisData();
          this.transformData(this.data);
          this.transformdata();
          this.colorGeneration();
          this.formLegendData();
          this. plotBubbleChart();

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
      this.data1=this.data;
     
      this.xaxisData();
      this.transformData(this.data1);
      this.transformdata();
      this.colorGeneration();
      this.formLegendData();
      this. plotBubbleChart();  
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



  transformData(data: any) {
    this.colordata=[];
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
    this.colordata=this.transformeddata;

  }

  plotBubbleChart() {

    let colors = this.predefinedcolors;
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

   // x.domain([0, d3.max(this.data, function (d) { return d[Object.keys(d)[1]] })]);
    y.domain([0, d3.max(this.data, function (d) { return d[Object.keys(d)[2]] })]);

    x.domain([this.minxvalue, this.maxxvalue]);

                      
var rScale = d3.scaleSqrt().rangeRound([6, 30]);


rScale.domain([d3.min(this.data, function(d){return  d[Object.keys(d)[4]] }), d3.max(this.data, function(d,i){return  d[Object.keys(d)[4]] })])

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

 let node=svg.selectAll(".dot")
      .data( this.bubblechartdata)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function (d){ return rScale(d[Object.keys(d)[4]]);})
      .attr("cursor", "pointer")
      .attr("cx", function (d) {
        return x(d[Object.keys(d)[1]]);
      })
      .attr("cy", function (d) { return y(d[Object.keys(d)[2]]); })
      .attr("fill",  function (d, ) { return d[Object.keys(d)[5]] })
      .attr('opacity', 0.7)
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
        this.bubbleChartClick(d);
        this.fordrillableClick(this, d, event);
        return tooltip.style("visibility", "hidden");
      });
}

formTooltipData(tooltipData: any) {
  let object = {};
  for (let [key, value] of Object.entries(tooltipData)) {
   if(key != 'color'){
      object[key] = value;
  }
  }
    return this.toolTipForBar(object);
}

 // Method on chart click
 bubbleChartClick(event: any) {
  let object = {};
  for (let [key, value] of Object.entries(event)) {
    object[key] = value;
  }
  this.chartClick(object);
}

resize() {

}
  xaxisData()
  {
        let array=[];
    this.minxvalue=0;
    this.maxxvalue=0;
    this.xaxisArray=[];
    this.xarray=[];
       this.data1.forEach(element => {
            array.push(element[1]);
        });
for(let i=1;i<array.length;i++)
{
    this.xaxisArray.push(array[i]);
}

    let minvalue=Math.floor(d3.min(this.xaxisArray));
    let maxvalue=Math.ceil(d3.max(this.xaxisArray));
    this.minxvalue=  5*(Math.floor(Math.abs(minvalue/5)));
    this.maxxvalue=5*(Math.ceil(Math.abs(maxvalue/5)));
   
  }
  
 colorGeneration() {
  this.legendarray=[]; 
  let i=0;
  let names = this.data1
  .map(e => e[3])
  .filter((e, i, a) => a.indexOf(e) === i);

  for(let j=1;j<names.length;j++)
  {
    let value=[];
    let obj={"label":"","color":"","value":[]};  
    this.colordata.forEach(element => {
              if(element[Object.keys(element)[3]]==names[j]) 
              {
                  element['color']=this.predefinedcolors[i];
                  value.push(element);
              }
          });
         obj["value"]=value;
         obj["label"]=names[j];
         obj["color"]=this.predefinedcolors[i];
         this.legendarray.push(obj);
         i++;
    }
 }

formLegendData()
{
   this.legendData=[];
   this.legendarray.forEach(element => {
      let legendobject = {};
      legendobject['label'] = element.label;
      legendobject['color'] = element.color;
      this.legendData.push(legendobject);
  });
}

onBubbleLegendClick(legendevent: any){
  this.legendarray.forEach(element => {
    if(legendevent.label==element.label){
      this.legendClick(element.value); 
    }    
  }); 
 
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

transformdata()
{
  this.bubblechartdata=[]
   let buubledata=[];
     this.colordata.forEach((element,i) => {
            
          buubledata.push(element[Object.keys(element)[4]]);
            
     });


        let data=buubledata.sort(function(a, b){return b - a});

        for(let j=0;j<=data.length;j++)
        {
              this.colordata.forEach(element => {
                 if(data[j]==element[Object.keys(element)[4]])
                 this.bubblechartdata.push(element);
               });
        }
}

}
