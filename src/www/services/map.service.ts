import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MapService {

  constructor() { }

  /**
   * Disable mouse events for map elements.
   * @param   {string|HTMLElement} element HTML element ID or the element object
   * @returns {undefined}        no return
   */
  disableMouseEvent(element: string | HTMLElement) {
    let el;

    if (typeof element === 'string') {
      el = document.getElementById(element) as HTMLElement;
    } else {
      el = element;
    }

    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
  }
}
