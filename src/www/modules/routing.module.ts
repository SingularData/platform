import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import SearchMainComponent from '../components/search-main/search-main.component';
import SearchResultComponent from '../components/search-result/search-result.component';

const routes: Routes = [
  { path: '',  component: SearchMainComponent },
  { path: 'search',  component: SearchResultComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export default class RoutingModule {}
