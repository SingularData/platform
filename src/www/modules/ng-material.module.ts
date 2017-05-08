import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule, MdIconRegistry } from '@angular/material';

const modules = [
  BrowserAnimationsModule,
  FlexLayoutModule,
  MaterialModule
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
