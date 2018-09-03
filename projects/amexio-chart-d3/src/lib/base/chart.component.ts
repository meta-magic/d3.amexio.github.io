
export interface PlotCart {
    
    plotD3Chart(): void;

    hideToolTip() : void;

    onClick(node:any) : void;

    showToolTip(node:any, x:any, y:any) : void;
}