import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

const modules = [
  HttpModule,
  FormsModule,
  BrowserModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export default class NgCoreModule { }
