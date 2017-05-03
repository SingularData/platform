import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'search-main',
  template: require('./search-main.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./search-main.component.less')
  ],
})
export default class SearchMainComponent {

  constructor(private router: Router) {

  }

  search(keywords: string): void {
    if (keywords === '') {
      return;
    }

    this.router.navigateByUrl('/search?q=' + encodeURIComponent(keywords));
  }

}
