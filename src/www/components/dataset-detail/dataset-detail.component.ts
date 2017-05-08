import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

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

  private dataset: any;
  private loading: boolean;
  private hide: any;

  constructor(
    private datasetService: DatasetService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.dataset = null;
    this.loading = true;
    this.hide = {};
  }

  ngOnInit() {
    this.hide = {};

    this.route.params
      .switchMap((params: Params) => {
        return this.datasetService.get(+params['id']);
      })
      .subscribe((result) => {
        this.dataset = result;
        this.loading = false;
      }, (error) => {
        this.loading = false;
        console.log(error);
      });
  }

  goBack() {
    this.location.back();
  }
}
