import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import SearchMainComponent from '../components/search-main/search-main.component';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main',  component: SearchMainComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export default class RoutingModule {}
