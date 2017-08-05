var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
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
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map