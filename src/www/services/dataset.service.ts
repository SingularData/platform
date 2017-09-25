import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { defaults } from 'lodash';

import 'rxjs/add/operator/map';

@Injectable()
export class DatasetService {

  defaultSearchOptions: SearchOptions;

  constructor(private http: Http) {
    this.defaultSearchOptions = Object.freeze({
      limit: 15,
      offset: 0
    });
  }

  search(keywords: string, options?: SearchOptions): Observable<any> {
    if (keywords === '') {
      return Observable.empty();
    }

    options = defaults(options || {}, this.defaultSearchOptions);

    return this.http.get('/api/dataset/search', {
      params: {
        q: encodeURIComponent(keywords),
        offset: options.offset,
        limit: options.limit
      }
    })
    .map((res) => res.json())
    .catch((result) => {
      throw new Error(result.message);
    })
    .map((result) => {

      for (let dataset of result.results) {
        dataset.keyword = dataset.keyword || [];
      }

      return result;
    });
  }

  getSearchOptions(page?: number): SearchOptions {
    if (!page) {
      page = 1;
    }

    return {
      limit: this.defaultSearchOptions.limit,
      offset: this.defaultSearchOptions.limit * (page - 1)
    };
  }

  get(identifier: string, latest?: boolean): Observable<any> {
    let url = '/api/dataset/' + identifier;

    if (latest) {
      url += '?latest=true';
    }

    return this.http.get(url)
      .map((res) => res.json())
      .catch((result) => {
        throw new Error(result.message);
      })
      .map((result) => {
        let dataset = result.result;

        if (!dataset.landingPage.startsWith('http')) {
          dataset.landingPage = 'http://' + dataset.landingPage;
        }

        return dataset;
      });
  }

  getRaw(identifier: string): Observable<any> {
    return this.http.get('/api/dataset/raw/' + identifier)
      .map((res) => res.json())
      .catch((result) => {
        throw new Error(result.message);
      })
      .map((result) => result.result);
  }
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
}
