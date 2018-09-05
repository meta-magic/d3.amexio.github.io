import { Input } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from "../base/base.component";

export class AmexioD3BaseLineComponent extends AmexioD3BaseChartComponent
{
    svgwidth : any;
    private _data      : any;
    private xaxisdata  : any[];
    private yaxisdata  : any[];
    private legenddata : any[];
    legends    : any[];

    protected multiseriesdata : any[];

    @Input('horizontal-scale') hScale : boolean = true;

    @Input('vertical-scale')   vScale : boolean = false;

    @Input('data') 
    set data(v:any){
        this._data = v;
        this.createXYAxisData();
    }

    get data(){
        return this._data;
    }


    protected createXYAxisData() : void {

        this.xaxisdata = [];
        this.yaxisdata = [];
        this.multiseriesdata = [];
        this.legenddata = [];
        this.legends = [];
        

        const msdarray : any [] =[];

        for (let index = 0; index < this._data[0].length; index++) {
            const legend = this._data[0][index];
            msdarray[index]=[];
            this.legenddata.push({'label':legend.label,'color':this.predefinedcolors[index+1]});
            if(index > 0)
                this.legends.push({'label':legend.label,'color':this.predefinedcolors[index]});
        }

        let i = 0;
        this._data.forEach(object => {
            if(i>0){
                let j = 0;
                object.forEach(a =>{
                    if(j===0){
                        this.xaxisdata.push({'label':a, 'value':a});
                    }else{
                        this.yaxisdata.push({'label':a, 'value':a});
                    }
                    msdarray[j].push(a);
                    j++;
                });
            }
            i++;
        });

        for (let index = 0; index < msdarray.length; index++) {
            const element = msdarray[index];
            if(index >0){
                let md : any [] = [];
                for (let j = 0; j < element.length; j++) {
                    const v = element[j];
                    md.push({'legend':this.legenddata[index].label,'label':this.xaxisdata[j].value, 'value':v});
                }
                this.multiseriesdata.push(md);
                this.legends[index-1].data = md;
            }
        }
    }

    protected initChart() : any {

        const svg       = d3.select("#"+this.componentId);
        const margin    = { top: 20, right: 20, bottom: 30, left: 40 };
        const width     = +this.svgwidth - margin.left - margin.right;
        const height    = +svg.attr("height") - margin.top - margin.bottom;
        const g         = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand()
                    .rangeRound([0, width])
                    .padding(0.1);                    
    
        const y = d3.scaleLinear()
                     .rangeRound([height, 0]);

        x.domain(this.xaxisdata.map( (d) => { return d.label;}));
        y.domain([0, d3.max(this.yaxisdata,  (d) => { return d.value; })]);
             
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("color", "grey")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("color", "grey")
            .call(d3.axisLeft(y));


        return{
            g, x, y, height, width
        }

    }    


    protected plotScale(g:any,x:any, y:any,height:any,width:any) : void 
    {
        if(this.vScale){
            g.append('g')
                .attr("color", "lightgrey")
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x).tickSize(-this.width).tickFormat(''));
        }
        if(this.hScale){
            g.append('g')
                .attr("color", "lightgrey")
                .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));     
        }
    }

 
    legendClick(node:any){
        const legendNode = JSON.parse(JSON.stringify(node));
        delete legendNode.color;
        legendNode.data.forEach(element => {
            delete element.legend;
        });
        this.onLegendClick.emit(legendNode);
    }
}