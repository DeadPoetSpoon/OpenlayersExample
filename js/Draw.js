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

    var source = new ol.source.Vector();
    var vector = new ol.layer.Vector({
      source: source,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
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

    var modify = new ol.interaction.Modify({source: source});
    map.addInteraction(modify);
    
    var draw, snap; // global so we can remove them later
    var typeSelect = document.getElementById('type');
    
    function addInteractions() {
      draw = new ol.interaction.Draw({
        source: source,
        type: typeSelect.value
      });
      map.addInteraction(draw);
      snap = new ol.interaction.Snap({source: source});
      map.addInteraction(snap);
    
    }
    
    /**
     * Handle change event.
     */
    typeSelect.onchange = function() {
      map.removeInteraction(draw);
      map.removeInteraction(snap);
      addInteractions();
    };
    
    addInteractions();


    return map;
  }
  
  
  
  
  $(function () { init(); })