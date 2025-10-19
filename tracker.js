const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobile) {
  document.getElementById("status").innerText = "Sending Location from Phone...";

  navigator.geolocation.watchPosition(
    (position) => {
      fetch("https://unpompous-thriftier-crosby.ngrok-free.dev/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          timestamp: Date.now()
        })
      });
    },
    (err) => {
      document.getElementById("status").innerText = "Location error: " + err.message;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  );

} else {
  const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [13.388, 52.517],
    zoom: 9.5,
    container: 'map',
  });

  let phoneMarker = null;

  async function fetchPhoneLocation() {
    try {
      const res = await fetch("https://unpompous-thriftier-crosby.ngrok-free.dev/get-loc");
      const data = await res.json();
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
      document.getElementById("status").innerText = "Error";
      console.error(err);
    }
  }

  setInterval(fetchPhoneLocation, 3000);
}
