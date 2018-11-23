import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseLineComponent } from "./baseline.component";
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { PlotCart } from "../base/chart.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommanDataService } from '../services/comman.data.service';
@Component({
    selector: 'amexio-d3-chart-line',
    templateUrl: "./line.component.html"
})
export class AmexioD3LineComponent extends AmexioD3BaseLineComponent implements PlotCart {

    @ViewChild('chartId') chartId: ElementRef;
    @ViewChild('divid') divid: ElementRef;
    @ViewChild('drillid') drillid:any;
    @Input('data-reader') datareader: string;
    @Input('level') level:number=0;
    @Input('target') target:number;
    @Input('drillable-data') drillabledatakey:any[]=[]
    drillableFlag:boolean = true;
    resizeflag:boolean=false;
 
    constructor(private myservice: CommanDataService) {
          super('line');
    }

    ngOnInit() {

        if (this.level <= 1){
        let resp: any
        if (this.httpmethod && this.httpurl) {
            this.myservice.fetchUrlData(this.httpurl, this.httpmethod).subscribe((response) => {
                resp = response;
            }, (error) => {
            }, () => {
                setTimeout(() => {
                    this.data = this.getResponseData(resp);
                    this.plotD3Chart();
                }, 0);
            });
        } else
            if (this.data) {
                setTimeout(() => {
                    this.data = this.getResponseData(this.data);
                    this.plotD3Chart();
                }, 0);
            }
        }      
    }


    fetchData(data: any) {
   
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
     this.myservice.postfetchData(this.httpurl,this.httpmethod, requestJson).subscribe((response) => {
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
          this.plotD3Chart();
      }, 0);
    } 

    resize() {

    this.svgwidth = 0;
    this.svg.selectAll("*").remove();

    this.resizeflag = true;
    this.svgwidth = this.divid.nativeElement.offsetWidth;
    this.plotD3Chart();
  

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

       // this.svgwidth = this.chartId.nativeElement.offsetWidth;
       if(this.resizeflag==false)
       {
  if(this.chartId){
            this.svgwidth = this.chartId.nativeElement.offsetWidth;
    } else{
               this.svgwidth = this.svgwidth;
        }
    }
        const tooltip = this.toolTip(d3);

        const linechart = this.initChart();

        this.plotScale(linechart.g, linechart.x, linechart.y, linechart.height, linechart.width);

        this.plotLine(linechart.g, linechart.x, linechart.y, linechart.height,
            linechart.width, [], tooltip, (1));

        for (let index = 0; index < this.multiseriesdata.length; index++) {
            this.plotLine(linechart.g, linechart.x, linechart.y, linechart.height,
                linechart.width, this.multiseriesdata[index], tooltip, (index + 1));
        }


    }

    private plotLine(g: any, x: any, y: any, height: any, width: any, data: any, tooltip: any, i: number): void {

        const line = d3.line()
            .x(function (d) { return x(d.label); })
            .y(function (d) { return y(d.value); });

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", this.predefinedcolors[i])
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr("cx", (d) => { return x(d.label); })
            .attr("cy", (d) => { return y(d.value); })
            .attr('r', 2)
            .attr("cursor", "pointer")
            .on("mouseover", (d) => {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", (d) => {
                return tooltip.html(
                    this.callTooltip(d)
                    //  this.toolTipForLine(d)

                    //  this.toolTipWithLegendandAxis(d.legend,d.label,d.value)

                )
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", (d) => {
                return tooltip.style("visibility", "hidden");
            })
            .on("click", (d) => {
                 this.lineChartClick(d);
                 this.fordrillableClick(this,d,event);
                 return tooltip.style("visibility", "hidden");
            });
    }

lineChartClick(d: any){
    let obj = {};
    obj[d.legend] = d.value;
    obj[this.xaxisname] = d.label;
    this.chartClick(obj);
}

    callTooltip(tooltipdata: any) {
        let obj = {};
        obj[tooltipdata.legend] = tooltipdata.value;
        obj[this.xaxisname] = tooltipdata.label;
        return this.toolTipForBar(obj);
    }
}