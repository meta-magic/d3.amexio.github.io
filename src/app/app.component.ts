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
          "label": "Card",
          "value": "90",
          "children": [
            {
              "label": "Form",
              "value": "40"
            },
            {
              "label": "Image",
              "value": "09"
            }
          ]
        },
        {
          "label": "B",
          "value": 100,
          "color": "yellow"
        },
        {
          "label": "C",
          "value": 56,
          "color": "green"
        },
        {
          "label": "D",
          "value": 120,
          "color": "blue"
        },
        {
          "label": "E",
          "value": 90,
          "color": "yellow"
        },
        {
          "label": "F",
          "value": 140,
          "color": "green"
        },
        {
          "label": "G",
          "value": 130,
          "color": "blue"
        },
        {
          "label": "H",
          "value": 110,
          "color": "yellow"
        },
        {
          "label": "I",
          "value": 70,
          "color": "green"
        },
        {
          "label": "J",
          "value": 170,
          "color": "blue"
        }
      ];
}
