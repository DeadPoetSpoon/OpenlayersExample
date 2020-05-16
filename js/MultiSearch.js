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
    
    var draw,snap;

    function addInteractions() {
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        draw = new ol.interaction.Draw({
          source: vectorSource,
          //type: $('#qgt').val()
          type: 'Polygon'
        });
        map.addInteraction(draw);
        snap = new ol.interaction.Snap({source: vectorSource});
        map.addInteraction(snap);
      }
      //画圆无法搜索到结果
    //   $('#qgt').change(function (e) { 
    //       e.preventDefault();
    //       addInteractions();
    //   });

    $("#gqb").click(function (e) { 
        e.preventDefault();
        addInteractions();
        draw.on('drawend',
        function (evt) { 
            vectorSource.clear();
            $('#info').html('无结果');
            //console.log($('#qglt').val());
            var featureRequest = new ol.format.WFS().writeGetFeature({
                srsName: 'EPSG:4326',
                featureNS: 'http://deadpoetspoon.xyz:8080/geoserver/OLMAP',
                featurePrefix: 'OLMAP',
                featureTypes: [$('#qglt').val()],
                outputFormat: 'application/json',
                filter: ol.format.filter.within('geom',evt.feature.getGeometry())
            });
            fetch('http://deadpoetspoon.xyz:8080/geoserver/OLMAP/wfs', {
                method: 'POST',
                body: new XMLSerializer().serializeToString(featureRequest)
              }).then(function(response) {
                //console.log(response.text());
                return response.json();
              }).then(function(json) {
                var features = new ol.format.GeoJSON().readFeatures(json);
                if(features.length>0){
                    vectorSource.addFeatures(features);
                    map.getView().fit(vectorSource.getExtent());
                    $('#info').empty();
                    
                    for(var j=0;j<features.length;j++){
                        var tag = '<div class="panel panel-default">'+
                        '<div class="panel-heading">'+
                        '<h4 class="panel-title">'+
                            '<a data-toggle="collapse" data-parent="#info"'+
                            'href="#f'+j+'">'+
                            '第'+String(j+1)+'个要素'+
                            '</a></h4></div>'+
                            '<div id="f'+j+'" class="panel-collapse collapse"><div class="panel-body">'+
                            '<div  class="table-responsive"><table class="table"><caption>要素属性表</caption>'+
                        '<thead><tr><th>属性名</th><th>属性</th></tr></thead><tbody>';
                        var keys = features[j].getKeys();
                        console.log(keys);
                        if(keys.length>0){
                            for(var t=0;t<keys.length;t++){
                                var s = JSON.stringify(features[j].get(keys[t]));
                                if(keys[t]!="geometry"){
                                    //$('#info').html(keys[t]+":"+s+";");
                                    tag = tag +'<tr>'+'<td>'+keys[t]+'</td>'+'<td>'+s+'</td>'+'</tr>';
                                }
                            }
                        }
                        $('#info').append(tag + '</tbody></table></div></div></div></div>');
                    }
                    
                }
              });

        },this);
    });

    $('#tqb').click(function (e) { 
        e.preventDefault();
        vectorSource.clear();
        $('#info').html('无结果');
        var featureRequest = new ol.format.WFS().writeGetFeature({
            srsName: 'EPSG:4326',
            featureNS: 'http://deadpoetspoon.xyz:8080/geoserver/OLMAP',
            featurePrefix: 'OLMAP',
            featureTypes: [$('#tqlt').val()],
            outputFormat: 'application/json',
            filter: ol.format.filter.like('pinyin','*'+$('#tqi').val()+'*')
        });
        fetch('http://deadpoetspoon.xyz:8080/geoserver/OLMAP/wfs', {
            method: 'POST',
            body: new XMLSerializer().serializeToString(featureRequest)
          }).then(function(response) {
            //console.log(response.text());
            return response.json();
          }).then(function(json) {
            var features = new ol.format.GeoJSON().readFeatures(json);
            if(features.length>0){
                vectorSource.addFeatures(features);
                map.getView().fit(vectorSource.getExtent());
                $('#info').html('');
                for(var j=0;j<features.length;j++){
                    var tag = '<div class="panel panel-default">'+
                    '<div class="panel-heading">'+
                    '<h4 class="panel-title">'+
                        '<a data-toggle="collapse" data-parent="#info"'+
                        'href="#f'+j+'">'+
                        '第'+String(j+1)+'个要素'+
                        '</a></h4></div>'+
                        '<div id="f'+j+'" class="panel-collapse collapse"><div class="panel-body">'+
                        '<div  class="table-responsive"><table class="table"><caption>要素属性表</caption>'+
                    '<thead><tr><th>属性名</th><th>属性</th></tr></thead><tbody>';
                    var keys = features[j].getKeys();
                    console.log(keys);
                    if(keys.length>0){
                        for(var t=0;t<keys.length;t++){
                            var s = JSON.stringify(features[j].get(keys[t]));
                            if(keys[t]!="geometry"){
                                //$('#info').html(keys[t]+":"+s+";");
                                tag = tag +'<tr>'+'<td>'+keys[t]+'</td>'+'<td>'+s+'</td>'+'</tr>';
                            }
                        }
                    }
                    $('#info').append(tag + '</tbody></table></div></div></div></div>');
                }
            }
          });
    });
    
    
    
    return map;
  }
  
  
  
  
  $(function () { init(); })