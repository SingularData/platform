import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import "rxjs/add/operator/map";

@Injectable()
export class DatasetService {
  private api: string;

  constructor(private http: HttpClient) {
    this.api = "https://2d8vhzbit7.execute-api.us-east-1.amazonaws.com/dev";
  }

  search(keywords?: string): Observable<any> {
    return this.http.get(this.api + "/api/datasets/search?q=" + keywords);
  }

  retrieve(id: string, part?: string): Observable<any> {
    let url = `${this.api}/api/datasets/${id}`;

    if (part) {
      url += `/${part}`;
    }

    return this.http.get(url);
  }
}
