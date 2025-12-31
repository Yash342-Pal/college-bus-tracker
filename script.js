/* ===============================
   NAVIGATION FUNCTIONS
================================ */

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

/* ===============================
   MAP + TRACKING
================================ */

if (document.getElementById("map")) {

  const selectedBus = localStorage.getItem("selectedBus") || "bus1";

  // Fixed student location (demo)
  const studentLocation = [22.7205, 75.8585];

  // Bus routes (demo paths)
  const busRoutes = {
    bus1: [
      [22.7196, 75.8577],
      [22.7210, 75.8590],
      [22.7235, 75.8615],
      [22.7260, 75.8640]
    ],
    bus2: [
      [22.7250, 75.8600],
      [22.7270, 75.8625],
      [22.7290, 75.8650]
    ]
  };

  let routeIndex = 0;
  const route = busRoutes[selectedBus];

  /* ---------- MAP INIT ---------- */

  const map = L.map("map").setView(studentLocation, 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  /* ---------- ICONS ---------- */

  const busIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  const studentIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35]
  });

  /* ---------- MARKERS ---------- */

  const busMarker = L.marker(route[0], { icon: busIcon })
    .addTo(map)
    .bindPopup("🚌 Bus Live Location")
    .openPopup();

  const studentMarker = L.marker(studentLocation, { icon: studentIcon })
    .addTo(map)
    .bindPopup("🎓 You are here");

  /* ---------- BUS STOPS ---------- */

  const busStops = [
    [22.7185, 75.8565],
    [22.7210, 75.8590],
    [22.7235, 75.8615]
  ];

  busStops.forEach((stop, i) => {
    L.marker(stop)
      .addTo(map)
      .bindPopup("🛑 Bus Stop " + (i + 1));
  });

  /* ---------- DISTANCE FUNCTION ---------- */

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
  }

  /* ---------- MOVE BUS (SMOOTH DEMO) ---------- */

  setInterval(() => {

    routeIndex++;
    if (routeIndex >= route.length) routeIndex = 0;

    const [busLat, busLng] = route[routeIndex];

    busMarker.setLatLng([busLat, busLng]);
    map.panTo([busLat, busLng]);

    const distance = getDistance(
      studentLocation[0],
      studentLocation[1],
      busLat,
      busLng
    );

    const eta = Math.max(1, Math.round((distance / 30) * 60));

    const infoBox = document.getElementById("info");
    if (infoBox) {
      infoBox.innerText =
        `🚌 Distance: ${distance} km | ⏱ ETA: ${eta} min`;
    }

  }, 3000);
}
