import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import SearchService from '../../services/search.service';

@Component({
  selector: 'search-result',
  template: require('./search-result.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./search-result.component.less')
  ],
})
export default class SearchResultComponent implements OnInit {

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .switchMap((params: Params) => this.searchService.search(params['q']))
      .subscribe((results) => {
        console.log(results);
      }, (error) => {
        console.log(error);
      });
  }

  search(keywords) {
    this.searchService.search(keywords)
      .subscribe((results) => {
        console.log(results);
      }, (error) => {
        console.log(error);
      });
  }

}
