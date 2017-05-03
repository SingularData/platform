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

  private keywords: string;
  private currentKeywords: string;
  private results: Array<any>;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {
    this.keywords = '';
    this.currentKeywords = this.keywords;
    this.results = [];
  }

  ngOnInit(): void {
    this.route.queryParams
      .switchMap((params: Params) => {
        this.keywords = params['q'];
        this.currentKeywords = params['q'];
        return this.searchService.search(params['q']);
      })
      .subscribe((results) => {
        this.results = results;
      }, (error) => {
        this.keywords = '';
        this.currentKeywords = '';
        console.log(error);
      });
  }

  search(keywords) {
    if (keywords === this.currentKeywords) {
      return;
    }

    this.searchService.search(keywords)
      .subscribe((results) => {
        this.results = results;
        this.currentKeywords = keywords;
      }, (error) => {
        console.log(error);
      });
  }

}
