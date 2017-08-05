var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AboutPageComponent } from '../components/about/about.component';
import { PortalPageComponent } from '../components/portal/portal.component';
import { SearchMainComponent } from '../components/search-main/search-main.component';
import { SearchResultComponent } from '../components/search-result/search-result.component';
import { DatasetDetailComponent } from '../components/dataset-detail/dataset-detail.component';
var routes = [
    { path: 'search', component: SearchResultComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'portals', component: PortalPageComponent },
    { path: 'dataset/:id', component: DatasetDetailComponent },
    { path: '', component: SearchMainComponent }
];
var NgRoutingModule = (function () {
    function NgRoutingModule() {
    }
    NgRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forRoot(routes)],
            exports: [RouterModule]
        })
    ], NgRoutingModule);
    return NgRoutingModule;
}());
export { NgRoutingModule };
//# sourceMappingURL=ng-routing.module.js.map