<h1 align="center">
  <br>
  <a href="http://www.amexio.tech/"><img src="https://image.ibb.co/kdy6Ev/logo.png" alt="Amexio" width="200"></a>
  <br>
    Amexio D3-Chart v0.1.9
  <br>
</h1>

<div align="center">
  <b>Amexio (Angular MetaMagic EXtensions for Inputs and Outputs)</b> is a rich set of  140+  Angular (4/5/6)
   Amexio D3 Charts support 13 D3 Charts </b>with <b>Amexio Drillable Charts</b> option

</div>
<br/>
<div align="center">
  <h3>
    <a href="http://www.amexio.tech/">
      Website
    </a>
    <span> | </span>
    <a href="https://gitter.im/amexio-github-io/">
      Forum
    </a>
    <span> | </span>
    <a href="https://www.metamagicglobal.com/">
      MetaMagic Global
    </a>
  </h3>
</div>

<br/>



## Angular CLI - Installation

### Overview

The Angular CLI is a tool to initialize, develop, scaffold and maintain Angular applications

### Getting Started

To install the Angular CLI:

```bash
npm install -g @angular/cli
```
Generating and serving an Angular project via a development server Create and run a new project:

```bash
ng new my-project
cd my-project
ng serve
```

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

For More on Angular CLI [commands](https://github.com/angular/angular-cli/wiki) click on the link.

## Amexio D3 Chart - Installation

To install this library, follow the steps given below:

To install the Amexio Chart-d3:

```bash
npm install amexio-chart-d3 --save
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from "@angular/forms";
import { AppComponent } from './app.component';

// To import Amexio Chart D3 :-
import { AmexioChartD3Module } from 'amexio-chart-d3';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AmexioChartD3Module,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
