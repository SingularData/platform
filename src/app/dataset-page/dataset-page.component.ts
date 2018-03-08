import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DatasetService } from "../dataset.service";
import * as L from "leaflet";

@Component({
  selector: "app-dataset-page",
  templateUrl: "./dataset-page.component.html",
  styleUrls: ["./dataset-page.component.scss"]
})
export class DatasetPageComponent implements OnInit {
  @ViewChild("datasetMap") mapContainer;

  status: string;
  dcat: any;
  original: any;
  map: L.Map;

  constructor(
    private activatedRouter: ActivatedRoute,
    private dataset: DatasetService
  ) {
    this.status = "load";
  }

  ngOnInit() {
    this.activatedRouter.params
      .switchMap((params: Params) => {
        return this.dataset.retrieve(params.id);
      })
      .subscribe(
        result => {
          this.dcat = result.result.dcat;
          this.original = JSON.stringify(result.result.original, null, 2);

          if (this.dcat.spatial) {
            setTimeout(() => {
              this.map = L.map(this.mapContainer.nativeElement, {
                center: L.latLng(0, 0),
                zoom: 2,
                minZoom: 2,
                preferCanvas: true,
                worldCopyJump: true
              });

              L.tileLayer(
                "http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
                {
                  attribution:
                    `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>` +
                    `, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>`
                }
              ).addTo(this.map);

              L.control.scale().addTo(this.map);

              const region = L.geoJSON(this.dcat.spatial, {
                style: () => {
                  return {
                    color: "#3F51B5",
                    fillColor: "#3F51B5"
                  };
                }
              }).addTo(this.map);

              this.map.fitBounds(region.getBounds());
            }, 500);
          }

          this.status = "success";
        },
        error => {
          console.log(error);
          this.status = "error";
        }
      );
  }
}
