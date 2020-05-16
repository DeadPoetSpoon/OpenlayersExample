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

    // map.on('singleclick', function(evt) {
    //     document.getElementById('info').innerHTML = '';
    //     var viewResolution = /** @type {number} */ (map.getView().getResolution());
    //     var url = tiled.getSource().getFeatureInfoUrl(
    //       evt.coordinate, viewResolution, 'EPSG:4326',
    //       {'INFO_FORMAT': 'text/html'});
    //     if (url) {
    //       fetch(url,{mode:'no-cors'})
    //         .then(function (response) { return response.text(); })
    //         .then(function (html) {
    //           document.getElementById('info').innerHTML = html;
    //         });
    //     }
    //   });
    map.on('singleclick', function(evt) {
        //document.getElementById('info').innerHTML = "Loading... please wait...";
        $('#info').html("Loading... please wait...");
        var view = map.getView();
        var viewResolution = view.getResolution();
        var source1 = tiled.getSource();
        var url = source1.getFeatureInfoUrl(
          evt.coordinate, viewResolution, view.getProjection(),
          {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
        if (url) {
          //document.getElementById('info').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
          $('#info').attr('data', url);
          //console.log(url);
        }
      });

      map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        var hit = map.forEachLayerAtPixel(pixel, function() {
          return true;
        });
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });

    return map;
  }
  
  
  
  $(function () { 
    init(); 
})