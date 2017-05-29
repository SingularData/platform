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
    .map((result) => {
      if (!result.success) {
        throw new Error(result.message);
      }

      for (let dataset of result.results) {
        dataset.tags = dataset.tags || [];
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

  get(id: string, version?: number): Observable<any> {
    let url = '/api/dataset/' + id;

    if (version) {
      url += '?version=' + version;
    }

    return this.http.get(url)
      .map((res) => res.json())
      .map((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.result;
      });
  }

  getRaw(id: string): Observable<any> {
    return this.http.get('/api/dataset/raw/' + id)
      .map((res) => res.json())
      .map((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.result;
      });
  }
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
}
