import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector : 'amexio-d3-legend',
    templateUrl : './legend.component.html'
})
export class AmexioD3Legend
{

    @Input('data') data : any;

    @Input('horizontal') horizontal : boolean = false;

    @Output() onClick : any = new EventEmitter<any>();

    constructor(){
   
    }

    onLegendClick(node:any){
        this.onClick.emit(node);
    }
}