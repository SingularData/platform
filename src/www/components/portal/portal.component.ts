import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Map } from 'leaflet';
import * as _ from 'lodash';

@Component({
  selector: 'portl-page',
  template: require('./portal.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('../../styles/material-table.less'),
    require('./portal.component.less')
  ],
})
export default class PortalPageComponent implements OnInit {

  private portals: Array<any>;
  private regions: any;
  private regionCount: number;
  private detailPage: string;
  private map: Map;
  private mapSidebar: L.Control.Sidebar;
  private showSidebar: boolean;
  private selectedRegion: any;
  private datasetSum: number;

  constructor(private http: Http) {
    this.portals = [];
    this.regions = {};
    this.regionCount = 0;
    this.datasetSum = 0;
    this.detailPage = 'map';
    this.showSidebar = false;
    this.selectedRegion = null;
  }

  ngOnInit(): void {

    this.http.get('/api/portals')
      .map((result) => result.json())
      .subscribe((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        this.portals = result.portals;

        for (let portal of this.portals) {
          this.datasetSum += +portal.datasetCount || 0;
        }

        /**
         * Initialize portal map
         */

        this.map = L.map('portal-map', {
          center: L.latLng(0, 0),
          zoom: 2
        });

        L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
        })
        .addTo(this.map);

        this.mapSidebar = L.control.sidebar('portal-map-sidebar', { position: 'right' }).addTo(this.map);
        this.showSidebar = true;

        let regions = _.groupBy(this.portals, 'region');
        let markerGroup = L.markerClusterGroup();

        for (let placeName in regions) {
          let portals = regions[placeName];
          let location = portals[0].location;
          let marker = L.marker([location.coordinates[1], location.coordinates[0]], {
            title: placeName
          })
          .on('click', () => {
            if (this.selectedRegion !== null && this.selectedRegion.name === placeName) {
              this.closeSidebar();
            } else {
              this.selectedRegion = {
                name: placeName,
                portals: regions[placeName]
              };
              this.openSidebar();
            }
          });

          markerGroup.addLayer(marker);

          this.regionCount += 1;
        }

        this.map.addLayer(markerGroup);
      });
  }

  switchPage(page: string) {
    if (page !== this.detailPage) {
      this.detailPage = page;
    }
  }

  openSidebar() {
    this.mapSidebar.open('portal-map-sidebar-home');
  }

  closeSidebar() {
    this.mapSidebar.close();
    this.selectedRegion = null;
  }
}
