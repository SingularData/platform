import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'portl-detail',
  template: require('./portal-detail.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./portal-detail.component.less')
  ],
})
export default class PortalDetailComponent {

  constructor(@Inject(MD_DIALOG_DATA) private portal: any) {

  }

}
