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
    multilinedata = [[{"datatype":"number","label":"Day"},{"datatype":"number","label":"Guardians of the Galaxy"},{"datatype":"number","label":"The Avengers"},{"datatype":"number","label":"Transformers: Age of Extinction"}],[1,37.8,80.8,41.8],[2,30.9,69.5,32.4],[3,25.4,57,25.7],[4,11.7,18.8,10.5],[5,11.9,17.6,10.4],[6,8.8,13.6,7.7],[7,7.6,12.3,9.6],[8,12.3,29.2,10.6],[9,16.9,42.9,14.8],[10,12.8,30.9,11.6],[11,5.3,7.9,4.7],[12,6.6,8.4,5.2],[13,4.8,6.3,3.6],[14,4.2,6.2,3.4]];
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
      node : any;

      onClick(event:any){
        this.node = event;
      }
}
