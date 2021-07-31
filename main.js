window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [1115470.5450063676, 6634164.33735743],
      zoom: 4,
      maxZoom: 10,
      minZoom: 2,
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    target: "js-map",
  });

  const openStreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: "OSMStandard",
  });

  const openStreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    }),
    visible: false,
    title: "OSMHumanitarian",
  });

  const stamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "https://tile.stamen.com/terrrain/{z}/{x}/{y}.jpg",
      attributions:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    }),
    visible: false,
    title: "OSMStamenTerrain",
  });

  //add layer simple
  //   map.addLayer(stamenTerrain);

  //Layer group
  const baseLayerGroup = new ol.layer.Group({
    layers: [openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain],
  });

  map.addLayer(baseLayerGroup);

  //add click map
  // map.on("click", function (e) {
  //   console.log(e.coordinate);
  // });

  //layer Switcher Logic for Basemaps
  const baseLayerElements = document.querySelectorAll(
    ".sidebar > input[type=radio]"
  );

  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener("change", function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerTitle = element.get("title");
        element.setVisible(baseLayerTitle === baseLayerElementValue);
      });
    });
  }

  //Vector Layers
  const fillStyle = new ol.style.Fill({
    color: [84, 118, 255, 1],
  });
  const strokeStyle = new ol.style.Stroke({
    color: [46, 45, 45, 1],
    width: 1.2,
  });
  const circleStyle = new ol.style.Circle({
    fill: new ol.style.Fill({
      color: [245, 49, 5, 1],
    }),
    radius: 7,
    stroke: strokeStyle,
  });
  const EUCountriesGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "./data/vector_data/EUCountries.geojson",
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    title: "EUCountriesGeoJSON",
    style: new ol.style.Style({
      fill: fillStyle,
      stroke: strokeStyle,
      image: circleStyle,
    }),
  });
  map.addLayer(EUCountriesGeoJSON);

  //fin vector layers

  // Vector Feature popup logic
  const overlayContainerElement = document.querySelector(".overlay-container");
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement,
  });
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureAdditionalInfor = document.getElementById(
    "feature-adittionalInfo"
  );

  map.on("click", function (e) {
    //para quitar texto
    overlayLayer.setPosition(undefined);

    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
      // console.log(feature.getKeys());
      // console.log(feature.get("name"));
      let clickedCoodinate = e.coordinate;
      // console.log(e.coordinate);
      let clickedFeatureName = feature.get("name");
      let clickedFeatureAdditionalInfo = feature.get("additionalInfo");
      // console.log(clickedFeatureName, clickedFeatureAdditionalInfo);
      overlayLayer.setPosition(clickedCoodinate);
      overlayFeatureName.innerHTML = clickedFeatureName;
      overlayFeatureAdditionalInfor.innerHTML = clickedFeatureAdditionalInfo;
    },
    {
      layerFilter: function (layerCandidate){
        return layerCandidate.get('title') === 'EUCountriesGeoJSON'
      }
    });
  });
}
