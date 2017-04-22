import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import AppComponent from '../components/app/app.component';
import ToolbarComponent from '../components/toolbar/toolbar.component';

import RoutingModule from './routing.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule
  ],
  declarations: [
    AppComponent,
    ToolbarComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export default class AppModule { }
