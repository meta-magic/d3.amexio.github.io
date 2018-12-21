import { Input, Output, EventEmitter } from "@angular/core";

export class AmexioD3BaseChartComponent{

    @Output() onLegendClick: any = new EventEmitter<any>();

    @Output() onChartClick: any = new EventEmitter<any>();

    @Output() onLineClick: any = new EventEmitter<any>();
   
    @Output() drillableEvent = new EventEmitter();
    
    @Input('data') data: any;

    @Input('http-url') httpurl: any;
    
    @Input('http-method') httpmethod: any;

    @Input('legend') legend: boolean = true ;

    @Input('color') colors: any;

    @Input('height') height: any = "300";

    @Input('width') width : any = "300";

    @Input('title') title: any = "";

    @Input('label-color') labelcolor: string = "black";

    @Input('label') labelflag: boolean = false;
    
    // -------------- added later on
    @Input('data-reader') datareader: string;
    @Input('level') level: number = 0;
    @Input('target') target: number;
    @Input('drillable-data') drillabledatakey: any[] = [];
    @Input('horizontal-scale') hScale: boolean = true;   
    @Input('vertical-scale')   vScale : boolean = false;

    resizeflag: boolean = false;
    //-------------------

    drillableFlag: boolean = true;


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

      protected getMultipleDrillbleKeyData(data:any,drillablekeys:any)
      {
       
          let nodeObject={};
          if(data)
          {
      for (let index = 0; index < drillablekeys.length; index++) {
                
           let element = drillablekeys[index];
           for (let [key,value] of Object.entries(data)) {
                   if (key == element) 
                      {
                            nodeObject[key] = value;
                       }
                   };
              }
              return nodeObject;
            }
       
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
        this.onLegendClick.emit(node);
    }

    chartClick(node:any){
        this.onChartClick.emit(node);
    }
    
    comboLineClick(node: any){
        this.onLineClick.emit(node);
    }
    fordrillableClick(ref: any,node: any,event: any)
     {
        this.drillableEvent.emit({ref: ref,node: node,event: event});
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
//------------------
        //   tooltiphtml = tooltiphtml + "<td>";
        //   tooltiphtml = tooltiphtml + key+':';
        //   tooltiphtml = tooltiphtml + "</td>";
//------------------
          tooltiphtml = tooltiphtml + "<td>";
          tooltiphtml = tooltiphtml + value;
          tooltiphtml = tooltiphtml + "</td>";
          tooltiphtml = tooltiphtml + "</tr>";
        }
      }
      tooltiphtml = tooltiphtml + "</table>";

      return tooltiphtml;
    }

    protected toolTipWithLegendandAxis(legend: string, xaxis:string, yaxis: string) :any{
        let tooltiphtml = "<div>";
        tooltiphtml = tooltiphtml + "<b>"+xaxis+"</b>, ";
        tooltiphtml = tooltiphtml + legend+"</b> ";
        tooltiphtml = tooltiphtml + "<b>"+yaxis+"</b> ";
        tooltiphtml = tooltiphtml + "</div>";
        return tooltiphtml;
    }

    protected toolTipForBar(tooltipData: any): any{
         let tooltiphtml= "<div>";
        for (let [key, value] of Object.entries(tooltipData)) {
            let sideStyle="float:left";
            tooltiphtml = tooltiphtml + "<div>";
         tooltiphtml = tooltiphtml + "<span style ="+sideStyle+" ><b>" + key +" "+ "</b>" +value + "</br></span>";
         tooltiphtml = tooltiphtml + "</div>";
        }

         return tooltiphtml;
    }

}