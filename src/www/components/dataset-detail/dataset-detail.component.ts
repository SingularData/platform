import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { MdSnackBar } from '@angular/material';
import { Map } from 'leaflet';
import * as marked from 'marked';

import 'rxjs/add/operator/switchMap';

import { DatasetService } from '../../services/dataset.service';

@Component({
  selector: 'dataset-detail',
  template: require('./dataset-detail.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./dataset-detail.component.less')
  ],
})
export default class DatasetDetailComponent implements OnInit {

  @ViewChild('datasetMap') mapContainer;

  private dataset: any;
  private loading: boolean;
  private map: Map;

  constructor(
    private datasetService: DatasetService,
    private snackBar: MdSnackBar,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.dataset = null;
    this.loading = true;
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.datasetService.get(params.id, params.version))
      .subscribe((result) => {

        // in case the description is in markdown format
        if (result.description) {
          result.description = marked(result.description);
        }

        for (let file of result.files) {
          if (file.description) {
            file.description = marked(file.description);
          }
        }

        this.dataset = result;

        if (this.dataset.region) {
          setTimeout(() => {
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

            L.control.scale().addTo(this.map);

            let region = L.geoJSON(this.dataset.region, {
              style: () => {
                return {
                  color: '#3F51B5',
                  fillColor: '#3F51B5'
                };
              }
            })
            .addTo(this.map);

            this.map.fitBounds(region.getBounds());
          }, 500);
        }

        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.dataset = null;
      });
  }

  goBack() {
    this.location.back();
  }

  openData(url) {
    window.open(url, '_blank');
  }

  openSnackBar(message) {
    this.snackBar.open(message, null, {
      duration: 2000
    });
  }

  switchToVersion(versionNumber) {
    this.router.navigateByUrl(`dataset/${this.dataset.uuid}?version=${versionNumber}`);
  }
}
