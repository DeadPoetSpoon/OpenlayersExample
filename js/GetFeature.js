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
  
  
  
  
  $(function () { 
    var map = init(); 
    $('#Btn_KeySearch').click(function (e) { 
      e.preventDefault();
      var st = $('#KeySearchCon').val();
      var vectorSource = new ol.source.Vector();
      var vector = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 4
          }),
          image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
              color: '#ffcc33'
          })
          })
      })
      });
      map.addLayer(vector);
      // generate a GetFeature request
      var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: 'http://deadpoetspoon.xyz:8080/geoserver/OLMAP',
        featurePrefix: 'OLMAP',
        featureTypes: ['railway'],
        outputFormat: 'application/json',
        filter: ol.format.filter.like('pinyin','*'+st+'*')
      });
  
      // then post the request and add the received features to a layer
      fetch('http://deadpoetspoon.xyz:8080/geoserver/OLMAP/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
      }).then(function(response) {
        //console.log(response.text());
        return response.json();
      }).then(function(json) {
        var features = new ol.format.GeoJSON().readFeatures(json);
        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent());
      });
    });
  })