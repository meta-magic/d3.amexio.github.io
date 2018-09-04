import { Input, Output, EventEmitter } from "@angular/core";


export class AmexioD3BaseChartComponent{

    @Output() onLegendClick: any = new EventEmitter<any>();

    @Output() onChartClick: any = new EventEmitter<any>();
    
    @Input('data') data: any;

    @Input('legend') legend: boolean = true ;

    @Input('color') colors: any;

    @Input('width') width: any = "300";

    @Input('height') height: any = "300";

    @Input('title') title: any = "";

    predefinedcolors: string[];
    
    componentId : string;

    private  possible : string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcddefghijklmonpqrstuvwxyz";

    colorIndex: number = 0;

    charttype : string;

    constructor(charttype:string) {
        this.colors = [];
        this.charttype = charttype;
        this.predefinedcolors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
        this.componentId = this.charttype  + "-" + this.generateId();
    }
  
    protected initializeData() {
        this.data.forEach(element => {
          element.color = this.getColor(element);
        });
      }

    private generateId(){
       let id = "";
       for(let i = 0; i<5; i++){
        id = id + this.possible
                           .charAt(Math.floor(Math.random()*this.possible.length));
       }
       id = id + "-"+new Date().getTime();
       return id;
    }

    private  getColor(object : any){
        if (object.color) {
            return object.color;
        }
        else if (this.colors.length > this.colorIndex) {
            const color = this.colors[this.colorIndex];
            this.colorIndex++;
            return color;
        }
        else if ((this.colors.length > 0) && (this.colors.length <= this.colorIndex)) {
            this.colorIndex = 0;
            const color = this.colors[this.colorIndex];
            return color;
        }
        else {
            const color = this.predefinedcolors[this.colorIndex];
            this.colorIndex++;
            return color;
        }
    }


    legendClick(node:any){
        debugger;
        this.onLegendClick.emit(node);
    }

    chartClick(node:any){
        debugger;
        this.onChartClick.emit(node);
    }
    
    protected toolTip (d3:any) :any{
       return  d3.select("body")
                      .append("div")
                      .attr('id','tooltipid')
                      .attr('class','amexiod3tooltip')
                      .style("position", "absolute")
                      .style("z-index", "10")
                      .style("visibility", "hidden");
    }

    protected toolTipContent(tooltipdata:any) :any{
      let tooltiphtml = "<table>";
      for (const key in tooltipdata) {
        if (tooltipdata.hasOwnProperty(key)) {
          const value = tooltipdata[key];
          tooltiphtml = tooltiphtml + "<tr>";
          tooltiphtml = tooltiphtml + "<td>";
          tooltiphtml = tooltiphtml + key;
          tooltiphtml = tooltiphtml + "</td>";
          tooltiphtml = tooltiphtml + "<td>";
          tooltiphtml = tooltiphtml + value;
          tooltiphtml = tooltiphtml + "</td>";
          tooltiphtml = tooltiphtml + "</tr>";
        }
      }
      tooltiphtml = tooltiphtml + "</table>";

      return tooltiphtml;
    }
}