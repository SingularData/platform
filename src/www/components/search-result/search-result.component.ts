import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { cloneDeep } from 'lodash';

import { SearchService } from '../../services/search.service';

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
  private nextPage: boolean;
  private currentPage: number;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {
    this.keywords = '';
    this.currentKeywords = this.keywords;
    this.results = [];

    this.currentPage = 1;
    this.nextPage = false;
  }

  ngOnInit(): void {
    this.route.queryParams
      .switchMap((params: Params) => {
        this.keywords = params['q'];
        this.currentKeywords = params['q'];
        return this.searchService.search(params['q']);
      })
      .subscribe((result) => {
        this.results = result.results;
        this.nextPage = result.nextPage;
      }, (error) => {
        this.keywords = '';
        this.currentKeywords = '';
        console.log(error);
      });
  }

  search(keywords: string, page?: number) {
    if (!page) {
      page = 1;
    }

    if (keywords === this.currentKeywords && page === this.currentPage) {
      return;
    }

    let options = this.searchService.getSearchOptions(page);

    this.searchService.search(keywords, options)
      .subscribe((result) => {
        this.results = result.results;
        this.currentKeywords = keywords;

        this.currentPage = page;
        this.nextPage = result.nextPage;
      }, (error) => {
        console.log(error);
      });
  }

  goToNextPage() {
    this.search(this.currentKeywords, this.currentPage + 1);
  }

  goToPreviousPage() {
    this.search(this.currentKeywords, this.currentPage - 1);
  }
}
