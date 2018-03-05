import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DatasetService } from "../dataset.service";

@Component({
  selector: "app-dataset-page",
  templateUrl: "./dataset-page.component.html",
  styleUrls: ["./dataset-page.component.scss"]
})
export class DatasetPageComponent implements OnInit {
  status: string;
  dcat: any;
  original: any;

  constructor(
    private activatedRouter: ActivatedRoute,
    private dataset: DatasetService
  ) {}

  ngOnInit() {
    this.activatedRouter.params
      .switchMap((params: Params) => {
        return this.dataset.retrieve(params.id);
      })
      .subscribe(
        result => {
          this.dcat = result.result.dcat;
          this.original = JSON.stringify(result.result.original, null, 2);
          this.status = "success";
        },
        error => {
          console.log(error);
          this.status = "error";
        }
      );
  }
}
