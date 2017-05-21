import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'search-main',
  template: require('./search-main.component.html'),
  styles: [
    require('../../styles/main.less'),
    require('./search-main.component.less')
  ],
})
export default class SearchMainComponent {

  private supportedPlatforms: Array<any>;

  constructor(private router: Router) {
    this.supportedPlatforms = [
      {
        name: 'CKAN',
        logo: require('../../media/images/ckan-logo.png'),
        url: 'http://ckan.org/'
      },
      {
        name: 'DKAN',
        logo: require('../../media/images/dkan-logo.png'),
        url: 'http://www.nucivic.com/dkan/'
      },
      {
        name: 'Socrata',
        logo: require('../../media/images/socrata-logo.png'),
        url: 'https://socrata.com/solutions/publica-open-data-cloud/'
      },
      {
        name: 'Junar',
        logo: require('../../media/images/junar-logo.jpg'),
        url: 'http://junar.com/'
      },
      {
        name: 'ArcGIS Open Data',
        logo: require('../../media/images/arcgis-logo.png'),
        url: 'http://opendata.arcgis.com/'
      },
      {
        name: 'OpenDataSoft',
        logo: require('../../media/images/opendatasoft-logo.png'),
        url: 'https://www.opendatasoft.com/'
      },
      {
        name: 'GeoNode',
        logo: require('../../media/images/geonode-logo.png'),
        url: 'http://geonode.org/'
      }
    ];
  }

  search(keywords: string): void {
    if (!keywords) {
      return;
    }

    this.router.navigateByUrl('search?q=' + encodeURIComponent(keywords));
  }

  openURL(url) {
    window.open(url, '_blank');
  }
}
