/// <reference path="../../typing/sidebar-v2.d.ts"/>

import 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import 'sidebar-v2/js/leaflet-sidebar.js';
import 'sidebar-v2/css/leaflet-sidebar.css';

import { NgModule } from '@angular/core';

import AppComponent from '../components/app/app.component';
import AboutPageComponent from '../components/about/about.component';
import PortalPageComponent from '../components/portal/portal.component';
import SearchMainComponent from '../components/search-main/search-main.component';
import SearchResultComponent from '../components/search-result/search-result.component';
import DatasetDetailComponent from '../components/dataset-detail/dataset-detail.component';

import { DatasetService } from '../services/dataset.service';

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
    SearchMainComponent,
    DatasetDetailComponent
  ],
  providers: [
    DatasetService
  ],
  bootstrap: [
    AppComponent
  ]
})
export default class AppModule { }
