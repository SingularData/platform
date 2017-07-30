import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { MdDialog } from '@angular/material';
import { Map } from 'leaflet';
import { groupBy, find } from 'lodash';

import 'rxjs/add/operator/map';

import PortalDetailComponent from '../portal-detail/portal-detail.component';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'portl-page',
  template: require('./portal.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./portal.component.less')
  ],
})
export default class PortalPageComponent implements OnInit, AfterViewInit {

  @ViewChild('portalMap') mapContainer;
  @ViewChild('portalMapSidebar') mapSidebarContainer;

  private portals: Array<any> = [];
  private portalList: any;
  private portalCount: number = 0;
  private regions: any = {};
  private regionCount: number = 0;
  private filters = ['Name', 'Platform', 'Location'];
  private currentFilter: string = 'Name';
  private filterKeywords: string = '';
  private map: Map;
  private mapSidebar: L.Control.Sidebar;
  private markerGroup: L.MarkerClusterGroup;
  private showSidebar: boolean = false;
  private selectedRegion: any = null;
  private datasetSum: number = 0;

  // for export
  private startDate: Date = new Date(2017, 0, 1);
  private exportDate: Date = new Date();
  private exportFormat: string = 'json';
  private csvReportExample: string;
  private jsonReportExample: any;

  constructor(
    private http: Http,
    private dialog: MdDialog,
    private mapService: MapService
  ) {
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

    this.csvReportExample = `
      The CSV file will include following columns:
      1. name
      2. platform
      3. location
      4. url
      5. description
      6. dataset count
      7. tag count
      8. category count
      9. publisher count
    `;

    this.jsonReportExample = JSON.stringify([
      {
        name: 'data.gov',
        url: 'data.gov',
        location: 'United States',
        description: 'USA Governmental Open Data Portal',
        datasetCount: 328421,
        tags: [
          { name: 'GIS', datasetCount: 23123 }
        ],
        categories: [
          { name: 'Economics', datasetCount: 5320 }
        ],
        publishers: [
          { name: 'NOAA', datasetCount: 126900 }
        ]
      }
    ], null, 2);
  }

  ngOnInit() {

    /**
     * Initialize map
     */
    this.map = L.map(this.mapContainer.nativeElement, {
      center: L.latLng(0, 0),
      zoom: 2,
      minZoom: 2,
      preferCanvas: true,
      worldCopyJump: true
    });

    L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    })
    .addTo(this.map);

    this.markerGroup = L.markerClusterGroup();
    this.map.addLayer(this.markerGroup);

    this.mapSidebar = L.control.sidebar(this.mapSidebarContainer.nativeElement, {
      position: 'right'
    })
    .addTo(this.map);
    this.mapService.disableMouseEvent(this.mapSidebarContainer.nativeElement);
    this.showSidebar = true;

    this.http.get('/api/portals')
      .map((result) => result.json())
      .subscribe((result) => {
        this.portals = result.result;
        this.portalCount = this.portals.length;
        this.refreshMap(this.portals);
        this.refreshList(this.portals);
        this.refreshDatasetSum(this.portals);
      });
  }

  ngAfterViewInit() {
    this.map.invalidateSize();
  }

  refreshMap(portals) {
    this.regionCount = 0;
    this.markerGroup.clearLayers();

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

  refreshDatasetSum(portals) {
    this.datasetSum = 0;

    for (let portal of portals) {
      this.datasetSum += +portal.datasetCount || 0;
    }
  }

  switchFilter(filter: string) {
    this.onFilterKeywordChanged(this.filterKeywords);
  }

  closeSidebar() {
    this.mapSidebar.close();
    this.selectedRegion = null;
  }

  export() {
    let year = this.exportDate.getFullYear();
    let month = this.exportDate.getMonth() + 1;
    let day = this.exportDate.getDate();
    let date = `${year}-${month}-${day}`;

    let baseUrl = location.href.split('/')[0];
    let url = `/api/portals/stats?date=${date}&format=${this.exportFormat}`;

    window.open(baseUrl + url, '_blank');
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
    this.refreshDatasetSum(portals);
  }

  openURL(url) {
    window.open(url, '_blank');
  }

  openGoogleForm() {
    this.openURL('https://docs.google.com/forms/d/1O8iqzAQi0twB0evujvmsE2ClGWT5gXe_KM0xffEtMMU');
  }
}
