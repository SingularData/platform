import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';

const modules = [
  HttpModule,
  FormsModule,
  BrowserModule,
  ClipboardModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export default class NgCoreModule { }
