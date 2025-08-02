import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCurrentLocationCoords } from "../utils/services/locationServices";

// Fix for default marker icons
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker = ({ onLocationSelect, userLocation }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (userLocation && userLocation.length === 2) {
      const newPos = { lat: userLocation[0], lng: userLocation[1] };
      setPosition(newPos);
      map.flyTo(userLocation, 13);
    }
  }, [userLocation, map]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPos = { lat, lng };
      setPosition(newPos);
      onLocationSelect({ latitude: newPos.lat, longitude: newPos.lng });
    },
  });

  return position ? (
    <Marker position={position} icon={defaultIcon}>
      <Popup>Delivery location selected</Popup>
    </Marker>
  ) : null;
};

const AddressMapPicker = ({ onAddressSelected }) => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    async function fetchLocation() {
      const currentLocation = await getCurrentLocationCoords();
      setUserLocation([currentLocation.latitude, currentLocation.longitude]);
      if (onAddressSelected) {
        onAddressSelected(currentLocation);
      }
    }
    fetchLocation();
  }, []);

  if (!userLocation) {
    return <div className="h-[400px] w-full">Loading map...</div>;
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
        />
        <LocationMarker
          userLocation={userLocation}
          onLocationSelect={onAddressSelected}
        />
      </MapContainer>
    </div>
  );
};

export default AddressMapPicker;
