import { AmexioD3DounutChartComponent } from './dounut/dounut.component';
import { AmexioD3PieChartComponent } from './pie/pie.component';
import { AmexioD3Legend } from './legend/legend.component';
import { AmexioD3BarChartComponent } from './bar/bar.component';
import { AmexioD3LineComponent } from './line/line.component';
import { BarstackComponent} from './barstack/barstack.component';
import{GroupbarComponent} from './groupbar/groupbar.component';
import{DrillableComponent} from './drillable/drillable/drillable.component';
import{ CombochartComponent } from './combochart/combochart.component';

export const D3_COMPONENTS : any[] = [
  AmexioD3Legend,
  AmexioD3DounutChartComponent,
  AmexioD3BarChartComponent,
  AmexioD3PieChartComponent,
  AmexioD3LineComponent,
  BarstackComponent,
  GroupbarComponent,
  CombochartComponent,
  DrillableComponent
]
