import { Component, AfterViewInit, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit, AfterViewInit {
  private fragment: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngAfterViewInit() {
    /**
     * The pure CSS solution doesn"t seem to work and it has to be done in TS.
     */

    const placeholder = document.getElementsByClassName(
      "mat-input-placeholder"
    )[0] as HTMLElement;
    placeholder.style.color = "white";
    placeholder.style.textAlign = "center";

    const underline = document.getElementsByClassName(
      "mat-input-ripple"
    )[0] as HTMLElement;
    underline.style.visibility = "visible";
    underline.style.backgroundColor = "white";

    if (this.fragment) {
      document.querySelector("#" + this.fragment).scrollIntoView();
    }

    this.route.fragment.subscribe(fragment => {
      if (this.fragment) {
        document.querySelector("#" + this.fragment).scrollIntoView();
      }
    });
  }

  search(keyword?: string) {
    this.router
      .navigateByUrl("search?q=" + encodeURIComponent(keyword), {
        skipLocationChange: false
      })
      .catch(err => console.log(err));
  }
}
