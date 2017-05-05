import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { defaults } from 'lodash';

@Injectable()
export class SearchService {

  private defaultSearchOptions: SearchOptions;

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

    return this.http.get('/api/search', {
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

      return result.results;
    });
  }
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
}
