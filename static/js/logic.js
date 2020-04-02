// --------------------------------------
// Import data into JS
// --------------------------------------

// earthquake json url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Performs GET request to the query URL
d3.json(url, function(data) {
    // Sends data.features object to the createFeatures function
    createFeatures(data.features);
  });

// --------------------------------------
// Features and Popups for Earthquakes
// --------------------------------------
function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "<p>" + "Magnitude" + " " + feature.properties.mag + "</p>");
  }

  function pointToLayer(geoJsonPoint, latlng) {
    return L.circleMarker(latlng);
  }

  function style(geoJsonFeature) {
    return {
      fillColor: getColor(geoJsonFeature.properties.mag),
      color: "royalblue",
      weight: 1.5,
      fillOpacity: .25, 
      radius: markerSize(geoJsonFeature.properties.mag / 1.5)
    }
  }

  function getColor(magnitude) {
    switch(true) {
      case magnitude > 5:
        return "#12c2e9";
      case magnitude > 4:
        return "#c471ed";
      case magnitude > 3:
        return "#f64f59";
      case magnitude > 2:
        return "#b92b27";
      case magnitude > 1:
        return "#1565C0";
      default:
        return "#373B44";
    }
  }
  

  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer,
      style: style
    });
  
    // Sends earthquakes layer to createMap function
    createMap(earthquakes);
}

// --------------------------------------
// Circles with varied radii
// --------------------------------------

function markerSize(earthquakeData) {
  return earthquakeData * 12;
}

// Arrays to hold created markers
var quakeMarkers = [];

// --------------------------------------
// Function to create earthquake map
// --------------------------------------
function createMap(earthquakes) {

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  });

  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
  });

  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
  });

  // --------------------------------------
  // Layers, Basemaps, and Overlay Objects
  // --------------------------------------
  var quakes = L.layerGroup(quakeMarkers);

  // BaseMaps object to hold base layer
  var baseMaps = {
    // "Street Map": streetmap,
    "Dark Map": darkmap,
    "Outdoors": outdoors,
    "Satellite": satellite
    // "Grayscale": grayscale
  };

  // Overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Inital map object with central coordinates at Las Vegas, NV
  var lvMap = L.map("map", {
      center: [36.17, -115.14],
      zoom: 5,
      layers: [darkmap, quakes, earthquakes]
    });


  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(lvMap);

  // --------------------------------------
  // Legend
  // --------------------------------------
  var legend = L.control({position: "bottomright"});
  
  legend.onAdd = function(lvmap) {
    var div = L.DomUtil.create('div', 'info legend')
    grades = [0, 1, 2, 3, 4, 5]
    
    div.innerHTML += '<i style="background: #373B44"></i><span>0-1</span><br>';
    div.innerHTML += '<i style="background: #1565C0"></i><span>1-2</span><br>';
    div.innerHTML += '<i style="background: #b92b27"></i><span>2-3</span><br>';
    div.innerHTML += '<i style="background: #f64f59"></i><span>3-4</span><br>';
    div.innerHTML += '<i style="background: #c471ed"></i><span>4-5</span><br>';
    div.innerHTML += '<i style="background: #12c2e9"></i><span>5-6</span><br>';

    // for (var i = 0; i < grades.length; i++) {
    //   div.innerHTML += ‘<i style=”background:’ + getColor(grades[i] + 1) + ‘”></i> ‘ + grades[i] + (grades[i + 1] ? ‘&ndash;’ + grades[i + 1] + ‘<br>’ : ‘+’);
    //   }
    

    return div;
  };

  legend.addTo(lvMap);
}
