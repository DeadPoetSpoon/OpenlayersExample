 //初始化
 var init = function () { 
    var bounds = [98.4469604492188, 10.40847730636597,
        125.085830688477, 50.5579261779785];
    var vectorSource = new ol.source.Vector({
        url: './geojson/chinacapital.geojson',
        format: new ol.format.GeoJSON()
      });
    
      
      var map = new ol.Map({
        controls: ol.control.defaults({
            attribution: true
           }).extend([
               new ol.control.ScaleLine({
                   units:'degrees'
               })
            ]),
        layers: [
          new ol.layer.Image({
            source: new ol.source.ImageWMS({
                url:'http://deadpoetspoon.xyz:8080/geoserver/OLMAP/wms',
                params:{
                    'LAYERS':'OLMAP:capital'
                }
            })
          }),
          new ol.layer.Vector({
            source: vectorSource
          })
        ],
        target: 'map',
        view: new ol.View({
          projection:'EPSG:4326',
          center: [104, 28],
          zoom: 3,
        })
      });
    map.getView().fit(bounds, map.getSize());
    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    map.addInteraction(select);

    var selectedFeatures = select.getFeatures();

    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
    condition: ol.events.condition.platformModifierKeyOnly
    });

    map.addInteraction(dragBox);

    dragBox.on('boxend', function() {
    // features that intersect the box geometry are added to the
    // collection of selected features

    // if the view is not obliquely rotated the box geometry and
    // its extent are equalivalent so intersecting features can
    // be added directly to the collection
    var rotation = map.getView().getRotation();
    var oblique = rotation % (Math.PI / 2) !== 0;
    var candidateFeatures = oblique ? [] : selectedFeatures;
    var extent = dragBox.getGeometry().getExtent();
    vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
        candidateFeatures.push(feature);
    });

    // when the view is obliquely rotated the box extent will
    // exceed its geometry so both the box and the candidate
    // feature geometries are rotated around a common anchor
    // to confirm that, with the box geometry aligned with its
    // extent, the geometries intersect
    if (oblique) {
        var anchor = [0, 0];
        var geometry = dragBox.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        var extent$1 = geometry.getExtent();
        candidateFeatures.forEach(function(feature) {
        var geometry = feature.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        if (geometry.intersectsExtent(extent$1)) {
            selectedFeatures.push(feature);
        }
        });
    }

    });

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function() {
    selectedFeatures.clear();
    });

    var infoBox = document.getElementById('info');

    selectedFeatures.on(['add', 'remove'], function() {
    var names = selectedFeatures.getArray().map(function(feature) {
        return feature.get('PINYIN');
    });
    if (names.length > 0) {
        infoBox.innerHTML = names.join(', ');
    } else {
        infoBox.innerHTML = 'No countries selected';
    }
    });
}


$(function () { 
  init(); 
})