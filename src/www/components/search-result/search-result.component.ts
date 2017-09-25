import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { DatasetService } from '../../services/dataset.service';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: [
    '../../styles/main.less',
    './search-result.component.less'
  ],
})
export class SearchResultComponent implements OnInit {

  keywords: string;
  currentKeywords: string;
  results: Array<any>;
  nextPage: boolean;
  currentPage: number;
  searching: boolean;

  constructor(
    private datasetService: DatasetService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.keywords = '';
    this.currentKeywords = this.keywords;
    this.results = null;

    this.currentPage = 1;
    this.nextPage = false;
    this.searching = false;
  }

  ngOnInit() {
    this.searching = true;

    this.activatedRouter.queryParams
      .switchMap((params: Params) => {

        if (!params.q) {
          throw new Error('Search keyworks are not defined.');
        }

        this.keywords = params.q;
        this.currentKeywords = params.q;
        this.currentPage = +params.page || 1;

        let options = this.datasetService.getSearchOptions(this.currentPage);
        return this.datasetService.search(params.q, options);
      })
      .subscribe((result) => {
        this.results = result.results;
        this.nextPage = result.nextPage;
        this.searching = false;
      }, (error) => {
        this.searching = false;
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

    this.router.navigateByUrl(`search?q=${encodeURIComponent(keywords)}&page=${page}`);
  }

  goToNextPage() {
    this.router.navigateByUrl(`search?q=${encodeURIComponent(this.keywords)}&page=${this.currentPage + 1}`);
  }

  goToPreviousPage() {
    this.router.navigateByUrl(`search?q=${encodeURIComponent(this.keywords)}&page=${this.currentPage - 1}`);
  }

  goToDetail(identifier: string) {
    this.router.navigate(['dataset', identifier], {
      queryParams: {
        latest: true
      }
    });
  }
}
