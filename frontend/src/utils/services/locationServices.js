import { useMapEvents } from "react-leaflet";

export const getCurrentLocationCoords = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(`Error getting location: ${error.message}`);
        reject(new Error(error.message));
      }
    );
  });
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name || "Address not found";
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Could not retrieve address";
  }
};

// Update the LocationMarker component's click handler:
// const map = useMapEvents({
//   async click(e) {
//     const { lat, lng } = e.latlng;
//     const address = await reverseGeocode(lat, lng);
//     setPosition({ lat, lng, address });
//     onLocationSelect({ lat, lng, address });
//   },
// });
