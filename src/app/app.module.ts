import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgMaterialModule } from "./ng-material/ng-material.module";
import { NgRoutingModule } from "./ng-routing/ng-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { EllipsisModule } from "ngx-ellipsis";
import { MarkdownModule } from "ngx-markdown";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { SearchPageComponent } from "./search-page/search-page.component";
import { DatasetPageComponent } from "./dataset-page/dataset-page.component";

import { DatasetService } from "./dataset.service";

import "leaflet";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    SearchPageComponent,
    DatasetPageComponent
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    NgMaterialModule,
    NgRoutingModule,
    HttpClientModule,
    EllipsisModule,
    MarkdownModule.forRoot()
  ],
  providers: [HttpClient, DatasetService],
  bootstrap: [AppComponent]
})
export class AppModule {}
