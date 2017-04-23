import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as mt from '@angular/material';

const modules = [
  BrowserAnimationsModule,
  FlexLayoutModule,
  mt.MdButtonModule,
  mt.MdInputModule,
  mt.MdToolbarModule,
  mt.MdProgressBarModule,
  mt.MdAutocompleteModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export default class NgMaterialModule { }
