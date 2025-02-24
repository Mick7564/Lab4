
var map = L.map('map').setView([40.73, -74], 11); // Ensure 'map' is defined and has a div in your html with id="map"

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mick756/cm7fk5t0x000001t248r8e7yo', // Your Mapbox style ID
    accessToken: 'pk.eyJ1IjoibWljazc1NiIsImEiOiJjbTdmaHhucTIwdDdxMmpwdTNsdXJhOTk1In0.fWczw0xPLzKvY7fdr7FNFA' // Your Mapbox access token
}).addTo(map);

// var map = L.map('map').setView([37.8, -96], 4);

// var tiles = L.tileLayer({'https://api.mapbox.com/styles/v1/mick756/cm7fk5t0x000001t248r8e7yo.html?title=copy&access_token=pk.eyJ1IjoibWljazc1NiIsImEiOiJjbTdmaHhucTIwdDdxMmpwdTNsdXJhOTk1In0.fWczw0xPLzKvY7fdr7FNFA&zoomwheel=true&fresh=true#11/40.73/-74'}, { 
//     maxZoom: 19}).addTo(map);
//     // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'


// mapboxgl.accessToken = 'pk.eyJ1IjoibWljazc1NiIsImEiOiJjbTdmaHhucTIwdDdxMmpwdTNsdXJhOTk1In0.fWczw0xPLzKvY7fdr7FNFA';
//     const map = new mapboxgl.Map({
//         container: 'map',
//         style: 'mapbox://styles/mick756/cm7fk5t0x000001t248r8e7yo',
//         projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
//         zoom: 1,
//         center: [30, 15]
//     });

var geoJson;

fetch('https://leafletjs.com/examples/choropleth/us-states.js')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data).addTo(map);
    });

function getColor(d) {
    return d > 1000 ? '#800026' :
    d > 500  ? '#BD0026' :
    d > 200  ? '#E31A1C' :
    d > 100  ? '#FC4E2A' :
    d > 50   ? '#FD8D3C' :
    d > 20   ? '#FEB24C' :
    d > 10   ? '#FED976' :
               '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

info.addTo(map);

// add legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

// //title

// var title = L.Control.extend({
//     options: {
//         position: 'topleft' // We'll adjust with CSS
//     },
//     onAdd: function (map) {
//     var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
//         container.innerHTML = '<h1 id="map-title">My Map Title</h1>'; // Add your title HTML
//         return container;
//     }
// });

// map.addControl(new title());