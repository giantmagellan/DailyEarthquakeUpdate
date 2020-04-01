// earthquake json url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Performs a GET request to the query URL
d3.json(url, function(data) {
    // Sends the data.features object to the createFeatures function
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

  layer.bindPopup("<h3>" + feature.properties.place +
  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");


    // onEachFeature: (feature, layer) => {
    //   layer.push(layer);
    // }

  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Sending earthquakes layer to createMap function
    createMap(earthquakes);
}

function markerSize(magnitude) {
  return magnitude * 15;
}

// Arrays to hold created markers
var quakeMarkers = [];

// Loop through each feature to create earthquake markers based on magnitude and locations
for (var j = 0; j < features.length; j++) {
  // setting marker radius for the location by passing the magnitude into the markerSize function
  quakeMarkers.push(
    L.circle(features[j].geometry.coordinates, {
      stroke: false,
      fillOpacity: 0.75,
      color: "white",
      fillColor: "white",
      radius: markerSize(features[j].properties.mag)
    })
  );
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
  });


  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
  });

  // Layer groups
  var quakes = L.layerGroup(quakeMarkers);

  // BaseMaps object to hold base layer
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Inital map object with central coordinates at Las Vegas, NV
  var lvMap = L.map("map", {
      center: [36.17, -115.14],
      zoom: 13,
      layers: [streetmap, earthquakes]
    });

  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(lvMap);
    
}
