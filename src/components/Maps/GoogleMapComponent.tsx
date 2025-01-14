import { GoogleMap, Marker } from '@react-google-maps/api';

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  markers?: { lat: number; lng: number }[];
  className?: string;
  zoom?: number;
}

export function GoogleMapComponent({ 
  center, 
  markers = [], 
  className,
  zoom = 15 
}: GoogleMapComponentProps) {
  // Centro padrão em Goiânia se nenhum centro for fornecido
  const defaultCenter = { lat: -16.6869, lng: -49.2648 };

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center || defaultCenter}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {markers.map((position, index) => (
          <Marker
            key={index}
            position={position}
          />
        ))}
      </GoogleMap>
    </div>
  );
}