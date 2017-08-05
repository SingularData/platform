import { Component } from '@angular/core';

@Component({
  selector: 'about-page',
  templateUrl: './about.component.html',
  styleUrls: [
    '../../styles/main.less',
    './about.component.less'
  ],
})
export class AboutPageComponent {
  scrollToAnchor(acnhor: string) {
    const element = document.querySelector('#' + acnhor);

    if (element) {
      element.scrollIntoView();
    }
  }
}
