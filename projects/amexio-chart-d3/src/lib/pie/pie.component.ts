import {Component, OnInit, Input, Output, EventEmitter,ViewChild, ElementRef} from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from "../base/base.component";
@Component({
  selector: 'amexio-d3-chart-pie',
  templateUrl: './pie.component.html'
})
export class AmexioD3PieChartComponent  implements  OnInit {

  @Input('data') data: any;

  @Output() onLegendClick: any = new EventEmitter<any>();

  @Output() onChartClick: any = new EventEmitter<any>();

  @Output() drillableEvent = new EventEmitter();

  @ViewChild('id') donutref: any;

  @Input() legend: boolean = true ;

  @Input('color') colors: any = [];

  @Input('width') width: any = "300";

  @Input('height') height: any = "300";

  @Input() title: any = "";

   @Input('http-url') httpurl: any;
    
   @Input('http-method') httpmethod: any;

   @Input('data-reader') datareader: string;

   @Input('level') level:number ;

   @Input('target') target:number;

   @Input('drillabledatakey') drillabledatakey:any

   drillableFlag:boolean = false;

   drillData: any;
  
  
  ngOnInit(){
  
  }
  
  legendClick(node:any){
    this.onLegendClick.emit(node);
  }

  chartClick(node:any){
       this.onChartClick.emit(node);
  }


  fordrillableClick(ref:any)
  {
     this.drillableEvent.emit(ref);
  }

 fetchData(data:any)
   {
          this.drillData = data;   
   }

  drawChart()
  {
   
    
          this.donutref.drillableFlag=true;
          this.donutref.drawChart();

  }
}
