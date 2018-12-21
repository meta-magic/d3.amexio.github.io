import { Component, OnInit } from '@angular/core';
import { GroupbarComponent } from '../groupbar/groupbar.component';
import { AmexioD3BarChartComponent } from '../bar/bar.component';
import { AmexioD3DounutChartComponent } from '../dounut/dounut.component';
import { AmexioD3PieChartComponent } from '../pie/pie.component';
import { AmexioD3LineComponent } from '../line/line.component';
import { BarstackComponent } from '../barstack/barstack.component';
import { CombochartComponent } from '../combochart/combochart.component'
import { HistogramComponent } from '../histogram/histogram.component'
import { ScatterchartComponent } from '../scatterchart/scatterchart.component'
import { MultiareaComponent } from '../multiarea/multiarea.component'
import { CandlestickComponent } from '../candlestick/candlestick.component'
import { BubbleComponent } from '../bubble/bubble/bubble.component'
import { AmexioD3TimelineChartComponent } from '../timeline/timeline.component'
import {
  AfterContentInit, AfterViewInit, ContentChildren,
  ElementRef, EventEmitter, Input, Output, QueryList, ViewChild,
  ViewChildren
} from '@angular/core';

export class ViewDrillableComponent implements OnInit {

  @ContentChildren(AmexioD3BarChartComponent, { descendants: true }) queryBarchartinput: QueryList<AmexioD3BarChartComponent>;
  barchartinput: AmexioD3BarChartComponent[];

  @ContentChildren(GroupbarComponent, { descendants: true }) QueryGroupbarchartinput: QueryList<GroupbarComponent>;
  groupbarchartinput: GroupbarComponent[];

  @ContentChildren(AmexioD3LineComponent, { descendants: true }) QueryLinechartinput: QueryList<AmexioD3LineComponent>;
  linechartinput: AmexioD3LineComponent[];

  @ContentChildren(AmexioD3PieChartComponent, { descendants: true }) QueryPiechartinput: QueryList<AmexioD3PieChartComponent>;
  piechartinput: AmexioD3PieChartComponent[];

  @ContentChildren(AmexioD3DounutChartComponent, { descendants: true }) QueryDonutchartinput: QueryList<AmexioD3DounutChartComponent>;
  donutchartinput: AmexioD3DounutChartComponent[];


  @ContentChildren(BarstackComponent, { descendants: true }) QueryBarStackchartinput: QueryList<BarstackComponent>;
  barstackchartinput: BarstackComponent[];

  @ContentChildren(CombochartComponent, { descendants: true }) QueryCombochartinput: QueryList<CombochartComponent>;
  combochartinput: CombochartComponent[];

  @ContentChildren(HistogramComponent, { descendants: true }) QueryHistogramchartinput: QueryList<HistogramComponent>;
  histogramchartinput: HistogramComponent[];

  @ContentChildren(ScatterchartComponent, { descendants: true }) QuerySatterchartinput: QueryList<ScatterchartComponent>;
  scatterchartinput: ScatterchartComponent[];

  @ContentChildren(MultiareaComponent, { descendants: true }) QueryMultiareachartinput: QueryList<MultiareaComponent>;
  multiareachartinput: MultiareaComponent[];

  @ContentChildren(CandlestickComponent, { descendants: true }) QueryCandlestickchartinput: QueryList<CandlestickComponent>;
  candlestickchartinput: CandlestickComponent[];

  @ContentChildren(BubbleComponent, { descendants: true }) QueryBubblechartinput: QueryList<BubbleComponent>;
  bubblechartinput: BubbleComponent[];

  @ContentChildren(AmexioD3TimelineChartComponent, { descendants: true }) QueryTimechartinput: QueryList<AmexioD3TimelineChartComponent>;
  timelinechartinput: AmexioD3TimelineChartComponent[];

  chartInputArray: any;

  constructor() {

  }

  ngOnInit() {

  }


  ngAfterViewInit() {

    return this.getComponentData();

  }

  getComponentData(): any {

    this.chartInputArray = [];

    this.barchartinput = this.queryBarchartinput.toArray();
    this.groupbarchartinput = this.QueryGroupbarchartinput.toArray();
    this.linechartinput = this.QueryLinechartinput.toArray();
    this.donutchartinput = this.QueryDonutchartinput.toArray();
    this.piechartinput = this.QueryPiechartinput.toArray();
    this.barstackchartinput = this.QueryBarStackchartinput.toArray();
    this.combochartinput = this.QueryCombochartinput.toArray();
    this.histogramchartinput = this.QueryHistogramchartinput.toArray();
    this.scatterchartinput = this.QuerySatterchartinput.toArray();
    this.multiareachartinput = this.QueryMultiareachartinput.toArray();
    this.candlestickchartinput = this.QueryCandlestickchartinput.toArray();
    this.bubblechartinput = this.QueryBubblechartinput.toArray();
    this.timelinechartinput = this.QueryTimechartinput.toArray();
    this.chartInputArray = this.chartInputArray.concat(this.barchartinput, this.groupbarchartinput, this.linechartinput, this.donutchartinput, this.piechartinput, this.barstackchartinput, this.combochartinput, this.histogramchartinput, this.scatterchartinput, this.multiareachartinput, this.candlestickchartinput, this.bubblechartinput, this.timelinechartinput);

    return this.chartInputArray;

  }





}
