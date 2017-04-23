import { NgModule } from '@angular/core';

import AppComponent from '../components/app/app.component';
import SearchMainComponent from '../components/search-main/search-main.component';
import SearchResultComponent from '../components/search-result/search-result.component';

import SearchService from '../services/search.service';

import RoutingModule from './routing.module';
import NgCoreModule from './ng-core.module';
import NgMaterialModule from './ng-material.module';

@NgModule({
  imports: [
    NgCoreModule,
    RoutingModule,
    NgMaterialModule
  ],
  declarations: [
    AppComponent,
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
