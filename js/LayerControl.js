 //初始化
 var init = function () { 
     var format = 'image/png';
     var bounds = [73.4469604492188, 3.40847730636597,
                  135.085830688477, 53.5579261779785];
     var layernamelist = ['OLMAP:capital','OLMAP:railway','OLMAP:road',
     'OLMAP:river','OLMAP:china_boundary','OLMAP:province_boundary'];
     var projection = new ol.proj.Projection({
         code: 'EPSG:4326',
         units: 'degrees',
         axisOrientation: 'neu'
     });
     var map = new ol.Map({
         controls: ol.control.defaults({
          attribution: true
         }),
         target: 'map',
         layers: [
          //a,b,c,d,e,f
         ],
         view: new ol.View({
           projection: projection
         })
     });
     map.getView().fit(bounds, map.getSize());

     for (let index = 0; index < layernamelist.length; index++) {
       l = layernamelist[index];
       var f = new ol.layer.Tile({
        visible: true,
        source: new ol.source.TileWMS({
         url: 'http://deadpoetspoon.xyz:8080/geoserver/OLMAP/wms',
         params: {'FORMAT': format, 
                  'VERSION': '1.1.1',
                  tiled: true,
                STYLES: '',
                LAYERS: l,
         }
        })
      });
      f.set('layerid',index);
      f.set('name',l.split(':')[1]);
      f.setZIndex(layernamelist.length-index);
      map.addLayer(f);
    }


     return map;
 }
//添加图层控制
 var addLayerCon = function (map) { 
     $(".layerlistli").remove();
     var layers =  map.getLayers();
     //console.log(layers.get('length'));
     var size = layers.get('length');
     for(var i=0;i<size;i++){
         //onsole.log( layers.item(i).get('name'));
         var layer = layers.item(i);
         var lname = layer.get('name');
         //添加调整图层顺序按钮
        var buttonup = '<button type="button" class="btn btn-xs btn-link" id="bu'+i+'">↑</button>';
        var buttondown = '<button type="button" class="btn btn-xs btn-link" id="bd'+i+'">↓</button>';
         //添加控制显示选择框
         var checkbox = '<span><label><input type="checkbox" class="checkbox-inline" unchecked id="layer'+i+'"></label></span>';
         if(layer.getVisible()){
            checkbox = '<span><label><input type="checkbox" class="checkbox-inline" checked id="layer'+i+'"></label></span>';
         }
         //显示ZIndex
         var zindex = '<span>&#160;&#160;</span><span class="label label-default" id="zindex'+ i +'">'+layer.getZIndex()+'</span>'
         var tag = '<li class="layerlistli">' + buttonup + buttondown + checkbox + 
         '<button type="button" class="btn btn-xs btn-link" id="name'+i+'">'+lname+'</button>' + zindex + '</li>';
         $("#layerlist").append(tag);
     }
     //绑定事件
     for (let j = 0; j < size; j++) {
       //是否可见
      $('#layer'+j).on('change',function () { 
        //console.log(layers.item(j).getZIndex());
        layers.item(j).setVisible(this.checked);
       });
       //上移
       $("#bu"+j).click(function (e) { 
         e.preventDefault();
         //console.log(layers.item(j).get('name'));
         layers.item(j).setZIndex(layers.item(j).getZIndex()+1);
         $("#zindex"+j).html(layers.item(j).getZIndex());
       });
       //下移
       $("#bd"+j).click(function (e) { 
        e.preventDefault();
        //console.log(layers.item(j).get('name'));
        layers.item(j).setZIndex(layers.item(j).getZIndex()-1);
        $("#zindex"+j).html(layers.item(j).getZIndex());
        console.log("object");
      }); 
      //透明度
      $("#name"+j).click(function (e) { 
        e.preventDefault();
        $(".Opacity").remove();
        var tag = '<div class="Opacity"><span>调整&#160;'+ layers.item(j).get('name')
        +'&#160;透明度:</span><input type="range" min="0" max="1" step="0.01" id="opacity"></div>';
        $("#controlcol").append(tag);
        console.log(String(layers.item(j).getOpacity()));
        $("#opacity").on('input change',function () { 
          layers.item(j).setOpacity(parseFloat($("#opacity").val()));
         });
         $("#opacity").val(String(layers.item(j).getOpacity()));
      });
     }
     return map;
 }



 $(function () { 
   addLayerCon(init()); 
 })