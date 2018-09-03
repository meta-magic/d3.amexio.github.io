import { Component, Input } from "@angular/core";

@Component({
    selector : 'amexio-d3-tooltip',
    templateUrl : './tooltip.component.html',
    styleUrls : ['./tooltip.component.css']
})

export class AmexioD3Tooltip{

    @Input('data') data : any;
}