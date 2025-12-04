const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Generate or reuse unique ID for this phone  
let ThreeViewEnabled = false;

  const map = new maplibregl.Map({
    style: "https://tiles.openfreemap.org/styles/liberty",
    center: [72.9831, 19.2073],
    pitch: 0,
    bearing: 0,
    zoom: 14,
    container: "map",
  });

 function ThreeViewport(ViewPortControl){
    if(!ViewPortControl){
      map.setPitch(0);
      map.setBearing(0);
    }
    else{
      map.setPitch(55.2);
      map.setBearing(-55.2);
    }
  }

function m3dView(){
  ThreeViewEnabled = !ThreeViewEnabled;
  ThreeViewport(ThreeViewEnabled);
}
let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
  deviceId = "device-" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("deviceId", deviceId);
}





function calculateDistance(lat1,lat2,lon1,lon2){
				const R = 6371e3;
				const toRad = deg => deg * Math.PI / 180;
				const dLat = toRad(lat2-lat1);
				const dLon = toRad(lon2-lon1);
				const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
				const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
				return R * c;
			}

function createGeoCircle(center, radius, points = 64){
				const coords = [];
				const earthRad = 6371e3;
				const lat = center.lat * Math.PI / 180;
				const lon = center.lng * Math.PI / 180;
				
				for (let i = 0; i <= points;  i++){
					const angle = (i * 360 / points) * Math.PI / 180;
					const dx = radius * Math.cos(angle);
					const dy = radius * Math.sin(angle);
					
					const latOff = lat + (dy / earthRad);
					const lonOff = lon + (dx / earthRad * Math.cos(lat));
					
					coords.push([
					lonOff * 180 / Math.PI,
					latOff * 180 / Math.PI
				]);
				}
				
				return {
					type: "Feature",
					geometry: {
						type: "Polygon",
						coordinates: [coords]
					}
				};
			}
			
			const geofence = {
				lat: 19.207385364043382,
				lng: 72.98311549254477,
				radius: 50
			};
			const geofenceCenter = {
				lat: geofence.lat,
				lng: geofence.lng,
			};
			
			let distance = null;
			let userLat = null;
			let userLon = null;
			let userMarker = null;




if (isMobile) {
  document.getElementById("status").innerText = "Sending Location from Phone...";

  navigator.geolocation.watchPosition(
    (position) => {
      fetch("https://a7d64c80-f620-40d1-be03-4ed7af8374ae-00-6mjphf1eg2nq.kirk.repl.co/update", {
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

distance = calculateDistance(lat,geofence.lat, lon, geofence.lng));
					if(distance <= geofence.radius){
						console.log("Inside");
						document.getElementById("status").innerText = "Inside";
					}
					else{
						console.log("Outside");
						document.getElementById("status").innerText = "Outside";
					}
    
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

  const phoneMarkers = {}; // 👈 store multiple markers

  async function fetchPhoneLocation() {
    try {
      const res = await fetch("https://a7d64c80-f620-40d1-be03-4ed7af8374ae-00-6mjphf1eg2nq.kirk.repl.co/get-loc");
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

distance = calculateDistance(lat,geofence.lat, lon, geofence.lng);
					if(distance <= geofence.radius){
						console.log("Inside");
						document.getElementById("status").innerText = "Inside";
					}
					else{
						console.log("Outside");
						document.getElementById("status").innerText = "Outside";
					}
        
      });
    } catch (err) {
      console.error("Fetch error:", err);
      document.getElementById("status").innerText = "Failed to fetch phone location.";
    }
  }
  setInterval(fetchPhoneLocation, 3000);
}











