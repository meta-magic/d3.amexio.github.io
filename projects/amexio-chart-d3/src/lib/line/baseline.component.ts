import { Input } from "@angular/core";
import * as d3 from 'd3';
import { AmexioD3BaseChartComponent } from "../base/base.component";
import { DeviceQueryService } from '../services/device.query.service';
import { nearer } from "q";

export class AmexioD3BaseLineComponent extends AmexioD3BaseChartComponent {
    @Input('width') svgwidth: number;
    private _data: any = [];
    private xaxisdata: any[];
    private xaxisdata1: any[];
    private yaxisdata: any[];
    private legenddata: any[];
    legends: any[];
    linelegends: any[];
    xarr: any[] = [];
    protected xaxisname: any;
    protected multiseriesdata: any[];
    svg: any;
    displayindex: number = 0;
    @Input('height') svgheight = 300;

    @Input('data')

    @Input('xaxis-interval') xinterval: number;

    @Input('http-url') httpurl: any;

    @Input('http-method') httpmethod: any;

    @Input('yaxis-interval') tickscount: number;
    // @Input('xaxis-interval') xtickscount: number = 3;
    @Input('color') linecolor = [];

    @Input('display-field') displayfield: string;

    @Input('rotate') slant = false;

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
        // ************************************************
        if (this.displayfield) {
            // find displayfield index

            this._data[0].forEach((element, index) => {

                if (element.label == this.displayfield) {
                    this.displayindex = index;
                }
            });
        }

        // ***********************************************

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


        let i = 0;
        // xaxisdata yaxisdata msdarray is formed here

        this._data.forEach(object => {

            if (i > 0) {
                let j = 0;
                let xobj = {};
                object.forEach(a => {

                    // if (j === 0) {
                    //     this.xaxisdata.push({ 'label': a, 'value': a });
                    // } else {
                    //     this.yaxisdata.push({ 'label': a, 'value': a });
                    // }

                    if ((j > 0) && (j !== this.displayindex)) {
                        this.yaxisdata.push({ 'label': a, 'value': a });
                    }

                    if (j == 0) {
                        xobj['value'] = a;
                    }

                    if (j == this.displayindex) {
                        xobj['label'] = a;
                    }


                    msdarray[j].push(a);
                    j++;
                });

                this.xaxisdata.push(xobj);



            }
            i++;
        });

        for (let index = 0; index < msdarray.length; index++) {

            const element = msdarray[index];

            if ((index > 0) && (index !== this.displayindex)) {

                let md: any[] = [];
                for (let j = 0; j < element.length; j++) {

                    const v = element[j];
                    md.push({ 'legend': this.legenddata[index].label, 'label': this.xaxisdata[j].label, 'value': v });
                }

                this.multiseriesdata.push(md);
                this.legends[index - 1].data = md;
            }
        }
    }

    recalculatescale(width: any) {

        // consider fontsize to be 10
        this.xaxisdata;
        let summationwidth = 0;
        if (!this.displayfield) {
            this.xaxisdata.forEach(element => {
                if (typeof (element.label) == 'string') {
                    summationwidth = summationwidth + (element.label.length * 10);
                }
                if (typeof (element.label) == 'number') {
                    let n = this.findDigitCount(element.label);
                    summationwidth = summationwidth + (n * 10);
                }
            });
        }

        if (this.displayfield) {
            this.xaxisdata.forEach(element => {
                // if (typeof (element.label) == 'string') {
                summationwidth = summationwidth + (element.label.length * 10);
                // }
            });
        }

        if (this.displayfield && this.slant) {
            summationwidth = this.xaxisdata.length * 10;
        }

        if (summationwidth > width) {
            //  function call

            this.calculatexaxisarray(summationwidth, width);
        }

    }

    calculatexaxisarray(summationwidth: any, width: any) {

        let interval = Math.round(summationwidth / width);
         this.generateNewAxis(interval, width);
    }

    generateNewAxis(interval, avlwidth) {
        this.xaxisdata

        let arr = [];
        let newarr = [];
        let min;
        let max;
        //    make Array out of this.xaxisdata
        this.xaxisdata.forEach(element => {
            // if (typeof (element.label) == 'number') {
            arr.push(element.label);
            // }
        });

        //null check on arr
        if (arr.length > 0) {
            // find min

            min = Math.min.apply(null, arr);
            //find max
            max = Math.max.apply(null, arr);

            let temp = Math.round(avlwidth / 10)
            let differential = (temp - (temp * 0.2)) / 4;

            //form new arr

            let j = Math.round(differential);
            //   hjlkllll
            let i;
            let isredundant = false;

            if (!this.displayfield) {
                newarr[0] = min;

                for (i = 1; j < this.xaxisdata.length; i++) {
                    j = Math.round((differential * i) + i);

                    isredundant = this.checkArrayRedundancy(newarr, Math.round(j));
                    if (isredundant) {
                        newarr[i] = Math.round(j + 1);
                    } else {
                        newarr[i] = Math.round(j);
                    }
                }

                this.sortarr(newarr);
            }

            if (this.displayfield) {
                for (i = 0; j < this.xaxisdata.length; i++) {

                    j = Math.round((differential * i) + i);

                    if (this.xaxisdata[j]) {
                        newarr[i] = this.xaxisdata[j].label;
                    }
                    else {
                        if (this.xaxisdata[j + 1]) {
                            newarr[i] = this.xaxisdata[j + 1].label;
                        }
                    }
                }

                this.xarr = newarr;

            }
        }
    }

    checkArrayRedundancy(newarr, chknum) {
        let inc = 0
        newarr.forEach(element => {
            if (chknum == element) {
                inc++;
            }
        });

        if (inc > 1) {
            return true;
        } else {
            return false;
        }
    }
    sortarr(newarr: any) {
        let i;
        let j;
        let temp;
        for (i = 0; i < newarr.length; ++i) {

            for (j = i + 1; j < newarr.length; ++j) {

                if (newarr[i] > newarr[j]) {

                    temp = newarr[i];
                    newarr[i] = newarr[j];
                    newarr[j] = temp;

                }

            }

        }

        //    newarr;
        this.setXaxisData(newarr)
    }

    setXaxisData(newarr: any) {

        this.xarr = newarr;

        // this.xaxisdata.push({label: 125, value: 125});

        // chk if newarr elements are present in xaxisdata
        let ispresent = false;
        newarr.forEach(arrelement => {
            this.xaxisdata.forEach(xaxiselement => {
                if (arrelement == xaxiselement.label) {
                    ispresent = true;
                }
            });

            if (!ispresent) {
                //create & push an obj in xaxisdata
                let obj = { label: arrelement, value: arrelement };
                this.xaxisdata.push(obj);
            }

            ispresent = false;
        });

        //  

        // change arr to arr of objs
        let xdata = [];
        newarr.forEach((element: any) => {
            let obj = { label: element, value: element }
            xdata.push(obj);
        });
        this.xaxisdata;
        this.xaxisdata1 = xdata;
        //initialize xaxis data
    }

    findDigitCount(n: number) {
        let count = 0;
        if (n >= 1)++count;

        while (n / 10 >= 1) {
            n /= 10;
            ++count;
        }
        return count;
    }

    setXinterval(width: number) {
        let interval = Math.round(this.xaxisdata.length / this.xinterval);

        let arr = [];
        let newarr = [];
        //    make Array out of this.xaxisdata
        this.xaxisdata.forEach(element => {
            if (typeof (element.label) == 'number') {
                arr.push(element.label);
            }
        });


        let min = Math.min.apply(null, arr);
        //find max
        let max = Math.max.apply(null, arr);
        let j = interval;
        let i;
        let ispresent = false;
        newarr[0] = min;
        // assa
        for (i = 1; j < max; i++) {
            j = interval * i;
            newarr[i] = j;
        }

        // newarr[i] = max;

        //inset numbers which are not present in xaxis domain but present in newarr

        newarr.forEach(arrelement => {

            this.xaxisdata.forEach(xaxiselement => {

                if (xaxiselement.label == arrelement) {

                    ispresent = true
                }
            });

            if (!ispresent) {

                let obj = { label: arrelement, value: arrelement }
                this.xaxisdata.push(obj);
            }

            ispresent = false;
        });

        // this.sortarr(newarr);

        // newarr;
        // this.xaxisdata;
        this.xarr = newarr;

    }

    setDisplayfieldXinterval(width) {
        let interval = Math.round(this.xaxisdata.length / this.xinterval);

        let arr = [];
        let newarr = [];
        //    make Array out of this.xaxisdata
        this.xaxisdata.forEach(element => {
            arr.push(element.label);
        });
        let min = 0;
        let max = this.xaxisdata.length - 1;
        let j = interval;
        let i;
        newarr[0] = this.xaxisdata[min].label;
        for (i = 1; j < max; i++) {
            newarr[i] = this.xaxisdata[j].label;
            j = interval * i;
        }
        newarr.push(this.xaxisdata[max].label)
        this.xarr = newarr;
    }

    // formatxaxisarr() {
    //     let formattedarr = [];
    //     let temp = '';

    //     if(this.xarr) {

    //     if (typeof (this.xarr[0]) == 'string') {
    //         // treat string
    //         this.xarr.forEach(element => {
        
    //             if (typeof (element) == 'string') {
    //                 temp = '';
    //                 temp = element[0] + element[1] + '..'
    //                 formattedarr.push(temp)
    //             }
    //         });
    //          this.xarr = formattedarr;
    //     }

    //     if (typeof (this.xarr[0]) == 'number') {
    //         // treat numerials
    //         // wrap numbers

    //     }
    //              }
    // }


    protected initChart(): any {
        const tooltip = this.toolTip(d3);
        //RESIZE STEP 2 START
        this.svg = d3.select("#" + this.componentId)
            .attr('viewBox', '0 0 ' + this.svgwidth + ' ' + this.svgheight);
        this.svg.selectAll("*").remove();

        const margin = { top: 40, right: 20, bottom: 30, left: 40 };
        //RESIZE STEP 2 ENDS HERE
        const width = +this.svgwidth - margin.left - margin.right;
        // this.xaxisdata;

        if (this.xinterval) {
            if (!this.displayfield) {
                this.setXinterval(width);
            }
            if (this.displayfield) {
                this.setDisplayfieldXinterval(width);

            }

        } else {
            this.recalculatescale(width);
        }

        const height = +this.svgheight - margin.top - margin.bottom;
        const g = this.svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scalePoint()
            .rangeRound([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .rangeRound([height, 0]);
        let xdomain;
        if (this.xaxisdata) {

            x.domain(this.xaxisdata.map((d) => {

                if (typeof (d.label) == 'string') {
                    return d.label;
                }
                else {
                    return parseInt(d.value)
                }
            }))
        }
        if (this.yaxisdata) {
            y.domain([0, d3.max(this.yaxisdata, (d) => { return d.value; })]);
        }
        //add axis
        let xaxisbottom = d3.axisBottom(x);
        if (this.xarr.length > 0) {
            // if(this.slant) {
            // this.formatxaxisarr();
            //  }
             xaxisbottom.tickValues(this.xarr)
        }
        if (this.deviceQueryService.IsDesktop() == true) {
            if (this.svgwidth <= 400) {

                g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xaxisbottom
                        // d3.axisBottom(x)
                        // .tickValues(this.xarr)
                    ).
                    selectAll("text")

                    .attr("y", 0)
                    .attr("x", 9)
                    .attr("dy", ".35em")
                    .attr("transform", "rotate(60)")
                    .style("text-anchor", "start");
            }
            else {
                let bottomaxis = g.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xaxisbottom)

                if (this.slant) {
                    // this.formatxaxisarr(); 

                    bottomaxis.selectAll("text")

                        .attr("cursor", "pointer")
                        .on("mouseover", (d) => {
                            return tooltip.style("visibility", "visible");
                        })
                        .on("mousemove", (d) => {
                            return tooltip.html(
                                this.callXaxisTooltip(d))
                                .style("top", (d3.event.pageY - 10) + "px")
                                .style("left", (d3.event.pageX + 10) + "px");
                        })
                        .on("mouseout", (d) => {
                            return tooltip.style("visibility", "hidden");
                        })
                        .on("click", (d) => {
                            return tooltip.style("visibility", "hidden");
                        })



                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start")
                        .style("font-size", 10);
                }
            }
        }
        else {
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                //   .attr("color", "grey")
                .call(xaxisbottom).
                selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(60)")
                .style("text-anchor", "start")
                .style("font-size", 10);
            ;
        }

        g.append("g")
            // .attr("color", "grey")
            .call(d3.axisLeft(y).ticks(this.tickscount))
        // tickSize(0,10));
        let rawdata = this._data;


        // call function to alter legends if displayfield condn satisfy
        this.alterLegend();

        return {
            g, x, y, height, width, rawdata
        }
        // 

    }


    protected plotScale(g: any, x: any, y: any, height: any, width: any): void {
        if (this.vScale) {
            g.append('g')
                .attr("color", "lightgrey")
                .attr('transform', 'translate(0,' + height + ')')
                .call(d3.axisBottom(x).
                    tickSize(-this.width).tickFormat('')
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


    alterLegend() {
        this.linelegends = [];
        if (this.displayfield) {

            this.legends.forEach(element => {
                if (element.label !== this.displayfield) {
                    this.linelegends.push(element);
                }
            });
        } else {
            this.linelegends = this.legends;
        }
    }

    callXaxisTooltip(tooltipdata: any) {
        var obj = {};
        obj['x-axis'] = tooltipdata;
        return this.toolTipForBar(obj);
    }
}