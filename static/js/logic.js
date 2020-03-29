// earthquake json url
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Performs a GET request to the query URL
d3.json(url, function(data) {
    // Sends the data.features object to the createFeatures function
    createFeatures(data.features);
  });

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {

    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
      });
    
      // Sending earthquakes layer to createMap function
      createMap(earthquakes);
}

function createMap(earthquakes) {

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

    // BaseMaps object to hold base layer
  var baseMaps = {
    "Dark Map": darkmap
  };

  // Overlay object to hold overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Inital map object with central coordinates at Las Vegas, NV
    var lvMap = L.map("map", {
        center: [36.17, -115.14],
        zoom = 13,
        layers: [earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(lvMap);
    
}
