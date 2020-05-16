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
    /**
     * Elements that make up the popup.
     */
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');


    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
    });


    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
    };  

    var map = init()
    map.addOverlay(overlay);
    map.on('singleclick', function(evt) {
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(coordinate);
        //console.log(hdms);
        content.innerHTML = '<p>你点击的位置是:</p><code>' + hdms +
            '</code>';
        overlay.setPosition(coordinate);
      }); 
    
})