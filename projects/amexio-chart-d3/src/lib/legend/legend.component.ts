import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from "@angular/core";

@Component({
    selector : 'amexio-d3-legend',
    templateUrl : './legend.component.html'
})
export class AmexioD3Legend implements OnChanges, OnInit
{

    @Input('data') data : any;

    @Input('horizontal') horizontal : boolean = false;
    temparr: any[] = [];
    @Output() onClick : any = new EventEmitter<any>();

    constructor(){
   
    }

    ngOnInit() {

        this.data = this.data;
        this.temparr = this.data;
    }
    ngOnChanges() {
        // debugger;
        // window.location.reload();
        this.data = this.data;
        this.temparr = this.data;
    }

    onLegendClick(node:any){
        this.onClick.emit(node);
    }
}