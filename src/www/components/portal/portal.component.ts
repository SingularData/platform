import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { MdDialog } from '@angular/material';
import { Map } from 'leaflet';
import { groupBy, find } from 'lodash';

import 'rxjs/add/operator/map';

import PortalDetailComponent from '../portal-detail/portal-detail.component';

@Component({
  selector: 'portl-page',
  template: require('./portal.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./portal.component.less')
  ],
})
export default class PortalPageComponent implements OnInit {

  private portals: Array<any> = [];
  private portalList: any;
  private portalCount: number = 0;
  private regions: any = {};
  private regionCount: number = 0;
  private currentView: string = 'Map';
  private currentFilter: string = 'None';
  private filterKeywords: string = '';
  private map: Map;
  private mapSidebar: L.Control.Sidebar;
  private markerGroup: L.MarkerClusterGroup;
  private showSidebar: boolean = false;
  private selectedRegion: any = null;
  private datasetSum: number = 0;

  constructor(private http: Http, private dialog: MdDialog) {
    this.portalList = {
      columns: [
        { name: 'Portal Name' },
        { name: 'Region' },
        { name: 'Platform' },
        { name: 'Dataset Count' },
        { name: 'Updated Date' }
      ],
      rows: []
    };
  }

  ngOnInit() {

    /**
     * Initialize map
     */

    this.map = L.map('portal-map', {
      center: L.latLng(0, 0),
      zoom: 2,
      preferCanvas: true,
      worldCopyJump: true
    });

    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    })
    .addTo(this.map);

    this.markerGroup = L.markerClusterGroup();
    this.map.addLayer(this.markerGroup);

    this.mapSidebar = L.control.sidebar('portal-map-sidebar', { position: 'right' }).addTo(this.map);
    this.showSidebar = true;

    this.http.get('/api/portals')
      .map((result) => result.json())
      .subscribe((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        this.portals = result.portals;
        this.portalCount = this.portals.length;
        this.refreshMap(this.portals);
        this.refreshList(this.portals);
      });
  }

  refreshMap(portals) {
    this.datasetSum = 0;
    this.regionCount = 0;
    this.markerGroup.clearLayers();

    for (let portal of this.portals) {
      this.datasetSum += +portal.datasetCount || 0;
    }

    let regions = groupBy(portals.filter((portal) => portal.region), 'region');
    let markers = [];

    for (let placeName in regions) {
      let regionPortals: any = regions[placeName];
      let location = regionPortals[0].location;
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

          this.mapSidebar.open('portal-map-sidebar-home');
        }
      });

      markers.push(marker);
      this.regionCount += 1;
    }

    this.markerGroup.addLayers(markers);
  }

  refreshList(portals) {
    this.portalList.rows = portals.map((portal) => {
      return {
        portalName: portal.name,
        region: portal.region,
        platform: portal.platform,
        datasetCount: portal.datasetCount,
        updatedDate: portal.updatedDate
      };
    });
  }

  switchView(view: string) {
    if (view !== this.currentView) {
      this.currentView = view;
    }
  }

  switchFilter(filter: string) {
    if (filter !== this.currentFilter) {
      this.currentFilter = filter;
      this.onFilterKeywordChanged(this.filterKeywords);
    }
  }

  closeSidebar() {
    this.mapSidebar.close();
    this.selectedRegion = null;
  }

  openDetailDialog(portal) {
    this.dialog.open(PortalDetailComponent, {
      data: portal
    });
  }

  onPortalListClick(event) {
    if (event.type !== 'click') {
      return;
    }

    let portal = find(this.portals, { name: event.row.portalName });
    this.openDetailDialog(portal);
  }

  onFilterKeywordChanged(keywords) {
    keywords = keywords.toLowerCase();
    let portals;

    if (this.currentFilter === 'Platform' && keywords) {
      portals = this.portals.filter((portal) => {
        if (!portal.platform) {
          return false;
        }

        return portal.platform.toLowerCase().indexOf(keywords) > -1;
      });
    } else if (this.currentFilter === 'Name' && keywords) {
      portals = this.portals.filter((portal) => portal.name.toLowerCase().indexOf(keywords) > -1);
    } else if (this.currentFilter === 'Location' && keywords) {
      portals = this.portals.filter((portal) => {
        if (!portal.region) {
          return false;
        }

        return portal.region.toLowerCase().indexOf(keywords) > -1;
      });
    } else {
      portals = this.portals;
    }

    /**
     * TODO: updating at each new character change is too costly
     */
    this.portalCount = portals.length;
    this.refreshMap(portals);
    this.refreshList(portals);
  }
}
