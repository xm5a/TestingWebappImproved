const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobile) {
  document.getElementById("status").innerText = "Sending Location from Phone...";

  navigator.geolocation.watchPosition(
    (position) => {
      fetch("https://a7d64c80-f620-40d1-be03-4ed7af8374ae-00-6mjphf1eg2nq.kirk.replit.dev/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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

  let phoneMarker = null;

async function fetchPhoneLocation() {
  try {
    const res = await fetch("https://a7d64c80-f620-40d1-be03-4ed7af8374ae-00-6mjphf1eg2nq.kirk.replit.dev/get-loc", {
      method: "GET",
      mode: "cors",
      headers: {
        "Accept": "application/json"
      }
    });

    // Check if response type is JSON
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let data;
    if (contentType.includes("application/json")) {
      data = await res.json(); // parse safely
    } else {
      const html = await res.text();
      console.error("Server returned non-JSON data:", html.slice(0, 200));
      throw new Error("Server returned HTML instead of JSON");
    }

    const { lat, lon } = data;
    document.getElementById("status").innerText = `Phone at: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;

    if (!phoneMarker) {
      phoneMarker = new maplibregl.Marker({ color: "blue" })
        .setLngLat([lon, lat])
        .addTo(map);
    } else {
      phoneMarker.setLngLat([lon, lat]);
    }

    map.setCenter([lon, lat]);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("status").innerText = "Failed to fetch phone location.";
  }
}
  setInterval(fetchPhoneLocation, 3000);
  }

