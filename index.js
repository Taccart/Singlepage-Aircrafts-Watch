var map ;
var knownFlights = new Object();
    function initialize() {
         map = L.map('map').setView([43.64653, 7.12196], 10);

        var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { // LIGNE 20
            attribution: '© OpenStreetMap contributors',
            maxZoom: 16
        });
        map.addLayer(osmLayer);

    }

    function updateAircraftInfo (aircraft) {
    var id= aircraft.hex;
    var position=[aircraft.lat,aircraft.lon];

    if (knownFlights.hasOwnProperty(id)) {
        if (position != knownFlights[id].marker.getLatLng()) {
            L.polyline([ position,   knownFlights[id].marker.getLatLng() ]).addTo(map);
            knownFlights[id].marker.setLatLng(position);
        }
      }
    else {
        knownFlights[id]= {};
        knownFlights[id].marker = L.marker(position)
        .bindPopup( 'Flight '+ aircraft.flight + '<br>altitude: '+aircraft.altitude+ '<br>vert: '+aircraft.vert_rate+ '<br>speed: '+aircraft.speed)
        .addTo(map);

    }
    knownFlights[id].lastUpdate = Date.now();
    }
    function updateMap() {
        fetch("aircraft.json")
         .then(response => response.json())
         .then(json => {
            for (i in json.aircraft) {
                aircraft=json.aircraft[i] ;
                console.log(aircraft);
                if ( aircraft.hasOwnProperty('lon')  && aircraft.hasOwnProperty('lat') ) {
                    updateAircraftInfo (aircraft  );
                 }
            }
         } );

     }

    const interval = setInterval(function() {
        updateMap()
     }, 1000);


