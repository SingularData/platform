import { Component } from '@angular/core';

@Component({
  selector: 'datarea-app',
  template: require('./app.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./app.component.less')
  ],
})
export default class AppComponent {
}
