import { NgModule } from '@angular/core';

import AppComponent from '../components/app/app.component';
import AboutPageComponent from '../components/about/about.component';
import PortalPageComponent from '../components/portal/portal.component';
import SearchMainComponent from '../components/search-main/search-main.component';
import SearchResultComponent from '../components/search-result/search-result.component';

import SearchService from '../services/search.service';

import NgRoutingModule from './ng-routing.module';
import NgCoreModule from './ng-core.module';
import NgMaterialModule from './ng-material.module';

@NgModule({
  imports: [
    NgCoreModule,
    NgRoutingModule,
    NgMaterialModule
  ],
  declarations: [
    AppComponent,
    AboutPageComponent,
    PortalPageComponent,
    SearchResultComponent,
    SearchMainComponent
  ],
  providers: [
    SearchService
  ],
  bootstrap: [
    AppComponent
  ]
})
export default class AppModule { }
