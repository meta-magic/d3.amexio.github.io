import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector : 'amexio-d3-legend',
    templateUrl : './legend.component.html'
})
export class AmexioD3Legend
{

    @Input('data') data : any;

    @Output() onClick : any = new EventEmitter<any>();

    onLegendClick(node:any){
        this.onClick.emit(node);
    }
}