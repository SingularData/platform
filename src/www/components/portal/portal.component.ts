import { Component } from '@angular/core';

@Component({
  selector: 'portl-page',
  template: require('./portal.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./portal.component.less')
  ],
})
export default class PortalPageComponent {
}
