import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdNativeDateModule } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const modules = [
  BrowserAnimationsModule,
  FlexLayoutModule,
  MaterialModule,
  NgxDatatableModule,
  MdNativeDateModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class NgMaterialModule {}
