const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Generate or reuse unique ID for this phone
let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
  deviceId = "device-" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("deviceId", deviceId);
}

if (isMobile) {
  document.getElementById("status").innerText = "Sending Location from Phone...";

  navigator.geolocation.watchPosition(
    (position) => {
      fetch("https://a7d64c80-f620-40d1-be03-4ed7af8374ae-00-6mjphf1eg2nq.kirk.replit.dev/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: deviceId,  // 👈 unique per phone
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          timestamp: Date.now(),
        }),
      });
    },
    (err) => {
      document.getElementById("status").innerText = "Location error: " + err.message;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
} else {
  const map = new maplibregl.Map({
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [72.9831, 19.2073],
    zoom: 14,
    container: "map",
  });

  const phoneMarkers = {}; // 👈 store multiple markers

  async function fetchPhoneLocation() {
    try {
      const res = await fetch("https://a7d64c80-f620-40d1-be03-4ed7af8374ae-00-6mjphf1eg2nq.kirk.replit.dev/get-loc");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json(); // now array of phones
      document.getElementById("status").innerText = `Tracking ${data.length} phone(s)`;

      data.forEach(({ id, lat, lon }) => {
        if (!phoneMarkers[id]) {
          phoneMarkers[id] = new maplibregl.Marker({ color: "blue" })
            .setLngLat([lon, lat])
            .addTo(map);
        } else {
          phoneMarkers[id].setLngLat([lon, lat]);
        }
      });
    } catch (err) {
      console.error("Fetch error:", err);
      document.getElementById("status").innerText = "Failed to fetch phone location.";
    }
  }

  setInterval(fetchPhoneLocation, 3000);
}
