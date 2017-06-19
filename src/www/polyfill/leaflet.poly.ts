/**
 * This is to resolve a problem between leaflet and webpack that may lead to
 * missing marker icon at Chrome. See more details:
 * https://github.com/Leaflet/Leaflet/issues/4968
 */

import L = require('leaflet');

let DefaultIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

L.Marker.prototype.options.icon = DefaultIcon;
