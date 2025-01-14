import { useState } from "react";
import { GoogleMapComponent } from "./GoogleMapComponent";
import type { MapMouseEvent } from "@/types/google-maps";

interface LocationPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

export const LocationPicker = ({
  initialLocation = { lat: -16.6869, lng: -49.2648 },
  onLocationSelect,
  className = "w-full h-[400px]"
}: LocationPickerProps) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setSelectedLocation(newLocation);
      onLocationSelect?.(newLocation);
    }
  };

  return (
    <div className={className}>
      <GoogleMapComponent
        center={selectedLocation}
        markers={[selectedLocation]}
        onClick={handleMapClick}
        className="w-full h-full"
      />
    </div>
  );
};