import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { defaults, isNumber } from 'lodash';

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

  get(id: number): Observable<any> {
    console.log(id);

    if (!isNumber(id)) {
      throw new Error('Invalid dataset ID.');
    }

    return this.http.get('/api/dataset/' + id)
      .map((res) => res.json())
      .map((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.result;
      });
  }

  getRaw(id: number): Observable<any> {
    if (!isNumber(id)) {
      throw new Error('Invalid dataset ID.');
    }

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
