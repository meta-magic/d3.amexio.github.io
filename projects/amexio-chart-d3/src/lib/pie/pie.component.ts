import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'amexio-d3-chart-pie',
  templateUrl: './pie.component.html'
})
export class PieComponent implements OnInit {

  @Input('data') data: any;

  @Output() onLegendClick: any = new EventEmitter<any>();
  
  @Input() legend: boolean = true ;

  @Input('color') colors: any = [];

  @Input('width') width: any = "300";

  @Input('height') height: any = "300";

  @Input() title: any = "";


  ngOnInit(){

  }

  onClick(event:any){
    this.onLegendClick.emit(event);
  }
}
