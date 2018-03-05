import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DatasetService } from "../dataset.service";

import "rxjs/add/operator/switchMap";

@Component({
  selector: "app-search-page",
  templateUrl: "./search-page.component.html",
  styleUrls: ["./search-page.component.scss"]
})
export class SearchPageComponent implements OnInit {
  keywords: string;
  status: string;
  datasets: Array<any>;

  constructor(
    private dataset: DatasetService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {
    this.status = "load";
    this.keywords = "";
    this.datasets = null;
  }

  ngOnInit() {
    this.sendSearchRequest();
  }

  search(keywords?: string) {
    this.router
      .navigateByUrl("search?q=" + encodeURIComponent(keywords))
      .then(() => this.sendSearchRequest())
      .catch(error => {
        console.log(error);
        this.status = "error";
      });
  }

  sendSearchRequest(keywords?: string) {
    this.activatedRouter.queryParams
      .switchMap((params: Params) => {
        this.keywords = params.q || "";
        return this.dataset.search(this.keywords);
      })
      .subscribe(
        result => {
          this.datasets = result.result;
          this.status = "success";
        },
        error => {
          console.log(error);
          this.status = "error";
        }
      );
  }
}
