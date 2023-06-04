// Create Map
var map1 = L.map("map", {center: [43, -125], zoom: 4});

// Create Tile Layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'}).addTo(map1);

// Color based on earthquake depth
function get_Color(Earthquake_Depth) {
    var my_color
    
    if (Earthquake_Depth >= 90) {my_color = "Red"}
    else if (Earthquake_Depth < 90 && Earthquake_Depth >= 50) {my_color = "Yellow"}
    else if (Earthquake_Depth < 50 && Earthquake_Depth >= 10) {my_color = "LawnGreen"}
    else {my_color = "Green"}
    
    return my_color
}

// Plot earthquake circles
function draw_Circle(point, latlng) {
    let Earthquake_Magnitude = point.properties.mag;
    let Earthquake_Depth = point.geometry.coordinates[2];
    return L.circle(latlng, {
            fillOpacity: 0.5,
            color: get_Color(Earthquake_Depth),
            fillColor: get_Color(Earthquake_Depth),
            // Set radius of circle based on magnitude
            radius: Earthquake_Magnitude * 20000
    })
}

// Info panel pop-up
function bindPopUp(feature, layer) {
    layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
}

// Earthquake URL
var url = " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// GeoJSON
d3.json(url).then((data) => {
    var features = data.features;

    // Map Info
    L.geoJSON(features, {
        pointToLayer: draw_Circle,
        onEachFeature: bindPopUp
    }).addTo(map1);


    var leg = L.control({position: 'bottomright'});

    leg.onAdd = () => {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 10, 50, 90];

        // Squares on legend
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + get_Color(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? ' to ' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    leg.addTo(map1);
});