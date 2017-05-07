import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import AboutPageComponent from '../components/about/about.component';
import PortalPageComponent from '../components/portal/portal.component';
import SearchMainComponent from '../components/search-main/search-main.component';
import SearchResultComponent from '../components/search-result/search-result.component';

const routes: Routes = [
  { path: 'search',  component: SearchResultComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'portals', component: PortalPageComponent },
  { path: '',  component: SearchMainComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export default class NgRoutingModule {}
