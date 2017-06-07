import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MapService {

  constructor() { }

  /**
   * Disable mouse events for map elements.
   * @param   {string} elementId HTML element ID
   * @returns {undefined}        no return
   */
  disableMouseEvent(elementId: string) {
    let element = <HTMLElement>document.getElementById(elementId);

    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }
}
