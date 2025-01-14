import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrigir o ícone do marcador
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  address: string;
}

export function LeafletMap({ address }: LeafletMapProps) {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data && data[0]) {
          setLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setError(null);
        } else {
          setError('Endereço não encontrado');
        }
      } catch (err) {
        setError('Erro ao buscar localização');
        console.error('Erro:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localização</h3>
            <div className="w-full h-[400px] rounded-lg overflow-hidden flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !location) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localização</h3>
            <div className="w-full h-[400px] rounded-lg overflow-hidden flex items-center justify-center text-red-500">
              {error || 'Localização não encontrada'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Localização</h3>
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <MapContainer
              center={location}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={location}>
                <Popup>{address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 