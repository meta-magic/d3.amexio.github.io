import { Input } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { DeviceQueryService } from '../services/device.query.service';

export class AmexioD3BaseLineComponent extends AmexioD3BaseChartComponent {
    @Input('width') svgwidth: number;
    private _data: any = [];
    private xaxisdata: any[];
    private yaxisdata: any[];
    private legenddata: any[];
    legends: any[];
    protected xaxisname: any;
    protected multiseriesdata: any[];
    svg: any;

    @Input('height') svgheight = 300;

    @Input('data')

    @Input('http-url') httpurl: any;

    @Input('http-method') httpmethod: any;

    @Input('yaxis-interval') tickscount: number;
    @Input('xaxis-interval') xtickscount: number = 3;
    @Input('color') linecolor = [];

    constructor(public deviceQueryService: DeviceQueryService) {
        super('line');
    }

    set data(v: any) {
        this._data = v;
        if (this._data && (this._data.length > 0)) {
            this.createXYAxisData();
        }

    }

    get data() {
        return this._data;
    }

    protected createXYAxisData(): void {
        this.labelcolor
        this.xaxisdata = [];
        this.yaxisdata = [];
        this.multiseriesdata = [];
        this.legenddata = [];
        this.legends = [];
        this.xaxisname = this.data[0][0].label;
        const msdarray: any[] = [];
        let count = 0
        for (let index = 0; index < this._data[0].length; index++) {
            const legend = this._data[0][index];
            msdarray[index] = [];
            let obj = {};
            obj['label'] = legend.label;
            if ((this.linecolor.length > 0) && this.linecolor[index]) {
                obj['color'] = this.linecolor[index];
            }
            else {
                obj['color'] = this.predefinedcolors[index];
            }
            this.legenddata.push(obj);

            // this.legenddata.push({'label':legend.label,'color':this.predefinedcolors[index+1]});
            if (index > 0) {
                let obj = {};
                obj['label'] = legend.label;
                if ((this.linecolor.length > 0) && this.linecolor[count]) {
                    obj['color'] = this.linecolor[count];
                } else {
                    obj['color'] = this.predefinedcolors[count];
                }
                this.legends.push(obj);
                count++;
                // this.legends.push({'label':legend.label,'color':this.predefinedcolors[index]});
            }
        }
        this.legends
        let i = 0;
        this._data.forEach(object => {
            if (i > 0) {
                let j = 0;
                object.forEach(a => {
                    if (j === 0) {
                        this.xaxisdata.push({ 'label': a, 'value': a });
                    } else {
                        this.yaxisdata.push({ 'label': a, 'value': a });
                    }
                    msdarray[j].push(a);
                    j++;
                });
            }
            i++;
        });

        for (let index = 0; index < msdarray.length; index++) {
            const element = msdarray[index];
            if (index > 0) {
                let md: any[] = [];
                for (let j = 0; j < element.length; j++) {
                    const v = element[j];
                    md.push({ 'legend': this.legenddata[index].label, 'label': this.xaxisdata[j].value, 'value': v });
                }
                this.multiseriesdata.push(md);
                this.legends[index - 1].data = md;
            }
        }
    }

    protected initChart(): any {
        //RESIZE STEP 2 START
        this.svg = d3.select("#" + this.componentId)
            .attr('viewBox', '0 0 ' + this.svgwidth + ' ' + this.svgheight);
        this.svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 30, left: 40 };
        //RESIZE STEP 2 ENDS HERE
        const width = +this.svgwidth - margin.left - margin.right;
        const height = +this.svgheight - margin.top - margin.bottom;
        const g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scalePoint()
            .rangeRound([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .rangeRound([height, 0]);
        if (this.xaxisdata) {
            x.domain(this.xaxisdata.map((d) => {
                return parseInt(d.label)
            }));
        }
        if (this.yaxisdata) {
            y.domain([0, d3.max(this.yaxisdata, (d) => { return d.value; })]);
        }
        //add axis 
        if (this.deviceQueryService.IsDesktop() == true) {
            if (this.svgwidth <= 400) {
                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x).ticks(this.xtickscount)).
                    selectAll("text")
                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(60)")
                    .style("text-anchor", "start");
            }
            else {
                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    //   .attr("color", "grey")
                    .call(d3.axisBottom(x).ticks(this.xtickscount))
            }
        }
        else {
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                //   .attr("color", "grey")
                .call(d3.axisBottom(x).ticks(this.xtickscount)).
                selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(60)")
                .style("text-anchor", "start");
        }

        g.append("g")
            // .attr("color", "grey")
            .call(d3.axisLeft(y).ticks(this.tickscount))
        // tickSize(0,10));
        return {
            g, x, y, height, width
        }

    }

    protected plotScale(g: any, x: any, y: any, height: any, width: any): void {
        if (this.vScale) {
            g.append('g')
                .attr("color", "lightgrey")
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x).
                    tickSize(-this.width).tickFormat('').ticks(this.xtickscount)
                );
        }
        if (this.hScale) {
            g.append('g')
                .attr("color", "lightgrey")
                .call(d3.axisLeft(y).ticks(this.tickscount)
                    .tickSize(-width).tickFormat(''));
        }
    }

    legendClick(node: any) {

        // const legendNode = JSON.parse(JSON.stringify(node));
        // delete legendNode.color;
        // legendNode.data.forEach(element => {
        //     delete element.legend;
        // });

        let obj = {};
        obj["label"] = node.label;
        let data = [];
        node.data.forEach(element => {
            let object = {};

            object[element.legend] = element.value;
            object[this.xaxisname] = element.label;
            //   object[element.label] = element.value;
            data.push(object);
        });
        obj["data"] = data;
        this.onLegendClick.emit(obj);

        // this.onLegendClick.emit(legendNode);
    }
}