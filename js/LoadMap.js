var init = function () { 
  var format = 'image/png';
  var bounds = [73.4469604492188, 3.40847730636597,
               135.085830688477, 53.5579261779785];
  var tiled = new ol.layer.Tile({
     visible: true,
     source: new ol.source.TileWMS({
       url: 'http://deadpoetspoon.xyz:8080/geoserver/OLMAP/wms',
       params: {'FORMAT': format, 
                'VERSION': '1.1.1',
                tiled: true,
             STYLES: '',
             LAYERS: 'OLMAP:OLMap',
       }
     })
   });
  var projection = new ol.proj.Projection({
      code: 'EPSG:4326',
      units: 'degrees',
      axisOrientation: 'neu'
  });
  var map = new ol.Map({
      controls: ol.control.defaults({
       attribution: false
      }),
      target: 'map',
      layers: [
       tiled
      ],
      view: new ol.View({
        projection: projection
      })
  });
  map.getView().fit(bounds, map.getSize());
  return map;
}




$(function () { init(); })