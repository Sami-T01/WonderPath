// js/map.js

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 51.5074, lng: -0.1278 },
    zoom: 13,
  });

  // 🔓 Make map and services globally available
  window.map = map;
  window.directionsService = new google.maps.DirectionsService();
  window.placesService = new google.maps.places.PlacesService(map);

  // 📍 Enable Autocomplete for start & end fields
  const startInput = document.getElementById('startInput');
  const endInput = document.getElementById('endInput');

  const startAuto = new google.maps.places.Autocomplete(startInput);
  const endAuto = new google.maps.places.Autocomplete(endInput);

  // Store selected LatLng globally
  window.startLocation = null;
  window.endLocation = null;

  startAuto.addListener('place_changed', () => {
    const place = startAuto.getPlace();
    window.startLocation = place.geometry?.location || null;
  });

  endAuto.addListener('place_changed', () => {
    const place = endAuto.getPlace();
    window.endLocation = place.geometry?.location || null;
  });
}

// Expose initMap globally for Maps API onLoad
window.initMap = initMap;
