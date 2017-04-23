import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export default class SearchService {

  constructor(private http: Http) {

  }

  search(keywords: string): Observable<any> {
    if (keywords === '') {
      return Observable.empty();
    }

    return this.http.get('/api/search?q=' + encodeURIComponent(keywords))
      .map((res) => res.json())
      .map((result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.results;
      });
  }
}
