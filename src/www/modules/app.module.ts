import { NgModule } from '@angular/core';

import { AppComponent } from '../components/app/app.component';
import { AboutPageComponent } from '../components/about/about.component';
import { PortalPageComponent } from '../components/portal/portal.component';
import { PortalDetailComponent } from '../components/portal-detail/portal-detail.component';
import { SearchMainComponent } from '../components/search-main/search-main.component';
import { SearchResultComponent } from '../components/search-result/search-result.component';
import { DatasetDetailComponent } from '../components/dataset-detail/dataset-detail.component';

import { DatasetService } from '../services/dataset.service';
import { MapService } from '../services/map.service';

import { NgRoutingModule } from './ng-routing.module';
import { NgCoreModule } from './ng-core.module';
import { NgMaterialModule } from './ng-material.module';

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
    PortalDetailComponent,
    SearchResultComponent,
    SearchMainComponent,
    DatasetDetailComponent
  ],
  providers: [
    DatasetService,
    MapService
  ],
  entryComponents: [
    PortalDetailComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
