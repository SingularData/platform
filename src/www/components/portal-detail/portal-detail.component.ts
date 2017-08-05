import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'portl-detail',
  templateUrl: './portal-detail.component.html',
  styleUrls: [
    '../../styles/main.less',
    './portal-detail.component.less'
  ],
})
export class PortalDetailComponent {

  portal: any;

  constructor(@Inject(MD_DIALOG_DATA) portalData: any) {
    this.portal = portalData;
  }

}
