import { useRef, useEffect } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';

interface PlacesAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export function PlacesAutocomplete({ 
  onPlaceSelect,
  placeholder = "Digite um endereço...",
  className = "w-full"
}: PlacesAutocompleteProps) {
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    const handlePlacesChanged = () => {
      const places = searchBoxRef.current?.getPlaces();
      if (places && places.length > 0 && onPlaceSelect) {
        onPlaceSelect(places[0]);
      }
    };

    if (searchBoxRef.current) {
      searchBoxRef.current.addListener('places_changed', handlePlacesChanged);
    }

    return () => {
      if (searchBoxRef.current) {
        google.maps.event.clearInstanceListeners(searchBoxRef.current);
      }
    };
  }, [onPlaceSelect]);

  return (
    <StandaloneSearchBox
      onLoad={(ref) => (searchBoxRef.current = ref)}
    >
      <Input
        type="text"
        placeholder={placeholder}
        className={className}
      />
    </StandaloneSearchBox>
  );
}