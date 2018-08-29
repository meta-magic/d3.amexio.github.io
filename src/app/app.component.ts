import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  donutData = [
    { label: "IE", value: 39.10 },
    { label: "Chrome", value: 32.51 },
    { label: "Safari", value: 13.68 },
    { label: "Firefox", value: 8.71 },
    { label: "Others", value: 6.01 }
];
              
barchartcolor = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];

barchartdata = [
  {
      "label": "A",
      "value": 180,
      "textcolor": "blue"
  },
  {
      "label": "B",
      "value": 100
  },
  {
      "label": "C",
      "value": 56
  },
  {
      "label": "D",
      "value": 120
  },
  {
      "label": "E",
      "value": 90
  },
  {
      "label": "F",
      "value": 140
  },
  {
      "label": "G",
      "value": 130
  },
  {
      "label": "H",
      "value": 110
  },
  {
      "label": "I",
      "value": 70
  },
  {
      "label": "J",
      "value": 170
  }
];

}
