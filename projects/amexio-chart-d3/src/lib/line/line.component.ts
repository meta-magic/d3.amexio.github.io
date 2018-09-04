import { PlotCart } from "../base/chart.component";
import { Component, Input } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseLineComponent } from "./baseline.component";

@Component({
    selector : 'amexio-d3-chart-line',
    templateUrl : "./line.component.html"
})
export class AmexioD3LineComponent extends AmexioD3BaseLineComponent implements PlotCart{

   
    constructor(){
        super('line');
    }

    ngOnInit(){
        this.initializeData();
        
        this.data.forEach(element => {
            element.label = element.label;
            element.value = +element.value;
        });

        setTimeout(()=>{
          this.plotD3Chart();
        },0);
    }

    plotD3Chart() : void {
       
        const tooltip = this.toolTip(d3);

        const linechart = this.initChart();

        this.plotScale(linechart.g, linechart.x, linechart.y, linechart.height, linechart.width);
        this.plotLine(linechart.g, linechart.x, linechart.y, linechart.height, linechart.width, this.data, tooltip,1);

    }


}