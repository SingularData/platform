import * as L from 'leaflet';
var DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
L.Marker.prototype.options.icon = DefaultIcon;
//# sourceMappingURL=leaflet.poly.js.map