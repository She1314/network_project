/*
 *   heatmap.js
 */
var map1;

function map(url) {
    map1 = new ol.Map({
        target: 'map', //地图容器div的id
        loadTilesWhileInteracting: true,
        layers: [],
        source: new ol.source.Vector({
            projection: 'EPSG:4326',
        }),
        view: new ol.View({
            center: [13182000, 3798965], //地图初始中心点
            zoom: 10, //地图初始显示级别
        }),
        controls: ol.control.defaults({}).extend([])
    });

    // 开始做热力图相关功能
    let blur = document.getElementById("blur");
    let radius = document.getElementById("radius");

    var wandaVector = new ol.source.Vector({
        url: url,
        format: new ol.format.GeoJSON()
    });
    //定义热力图图层
    let vector = new ol.layer.Heatmap({
        source: wandaVector,
        blur: parseInt(blur.value, 10),
        radius: parseInt(radius.value, 10),
    });

    // 模糊按钮的回调函数
    let blurHandler = function () {
        vector.setBlur(parseInt(blur.value, 10));
    };
    blur.addEventListener("input", blurHandler);
    blur.addEventListener("change", blurHandler);

    // 半径按钮的回调函数
    let radiusHandler = function () {
        vector.setRadius(parseInt(radius.value, 10));
    };
    radius.addEventListener("input", radiusHandler);
    radius.addEventListener("change", radiusHandler);

    //添加OSM地图作为底图
    var osm = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    map1.addLayer(osm);
    map1.addLayer(vector);
}