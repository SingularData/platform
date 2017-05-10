import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdIconRegistry } from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import '@swimlane/ngx-datatable/release/index.css';
import '@swimlane/ngx-datatable/release/themes/material.css';
import '@swimlane/ngx-datatable/release/assets/icons.css';

const modules = [
  BrowserAnimationsModule,
  FlexLayoutModule,
  MaterialModule,
  NgxDatatableModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export default class NgMaterialModule {

  constructor(private mdIconRegistry: MdIconRegistry) {
    mdIconRegistry.addSvgIconSetInNamespace('fa', 'fonts/fontawesome-webfont.svg');
  }

}
