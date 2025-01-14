import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMapComponent } from './GoogleMapComponent';
import { PlacesAutocomplete } from './PlacesAutocomplete';

interface LocationPickerProps {
  onLocationSelect?: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialAddress?: string;
  className?: string;
}

export function LocationPicker({ 
  onLocationSelect,
  initialAddress,
  className = "space-y-4"
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const location = {
        address: place.formatted_address || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setSelectedLocation(location);
      onLocationSelect?.(location);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      // Quando clica no mapa, faz geocoding reverso para obter o endereço
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: event.latLng },
        (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === "OK" && results?.[0]) {
            const location = {
              address: results[0].formatted_address,
              lat: event.latLng!.lat(),
              lng: event.latLng!.lng()
            };
            setSelectedLocation(location);
            onLocationSelect?.(location);
          }
        }
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className={className}>
          <PlacesAutocomplete
            onPlaceSelect={handlePlaceSelect}
            placeholder="Buscar endereço..."
          />
          <GoogleMapComponent
            center={selectedLocation || undefined}
            markers={selectedLocation ? [selectedLocation] : []}
            onClick={handleMapClick}
            className="w-full h-[400px] rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}