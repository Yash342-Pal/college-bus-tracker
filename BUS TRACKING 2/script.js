function goDriver() {
  window.location.href = "driver.html";
}

function goStudent() {
  window.location.href = "student.html";
}

function startDriver() {
  window.location.href = "track.html";
}

function trackBus() {
  const bus = document.getElementById("bus").value;
  localStorage.setItem("selectedBus", bus);
  window.location.href = "track.html";
}

// ================= MAP + TRACKING =================

if (document.getElementById("map")) {

  const selectedBus = localStorage.getItem("selectedBus") || "bus1";

  // Student location (fixed demo)
  const studentLocation = [22.7205, 75.8585];

  // Multiple buses
  const buses = {
    bus1: { lat: 22.7196, lng: 75.8577 },
    bus2: { lat: 22.7250, lng: 75.8600 }
  };

  // Bus stops
  const busStops = [
    [22.7185, 75.8565],
    [22.7210, 75.8590],
    [22.7235, 75.8615]
  ];

  let busLat = buses[selectedBus].lat;
  let busLng = buses[selectedBus].lng;

  const map = L.map("map").setView(studentLocation, 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    .addTo(map);

  // Icons
  const busIcon = L.icon({
    
  iconUrl: "https://img.icons8.com/ios-filled/50/bus.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});


  const studentIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    iconSize: [35, 35],
  });

  // Markers
  const busMarker = L.marker([busLat, busLng], { icon: busIcon }).addTo(map);
  const studentMarker = L.marker(studentLocation, { icon: studentIcon })
    .addTo(map)
    .bindPopup("🎓 You are here")
    .openPopup();

  // Bus stops markers
  busStops.forEach((stop, i) => {
    L.marker(stop).addTo(map).bindPopup("🛑 Bus Stop " + (i + 1));
  });

  // Distance formula (Haversine)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  }

  // Move bus + update ETA
  setInterval(() => {
    busLat += 0.0003;
    busLng += 0.00025;

    busMarker.setLatLng([busLat, busLng]);

    const distance = getDistance(
      studentLocation[0],
      studentLocation[1],
      busLat,
      busLng
    );

    const eta = Math.round((distance / 30) * 60); // 30 km/h avg speed

    document.getElementById("info").innerText =
      `🚌 Distance: ${distance} km | ⏱️ ETA: ${eta} min`;

    map.panTo([busLat, busLng]);

  }, 2000);
}
