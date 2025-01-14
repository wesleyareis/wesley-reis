import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMapComponent } from '@/components/Maps/GoogleMapComponent';
import { useGoogleMaps } from '@/components/Maps/GoogleMapsProvider';

interface ImovelLocalizacaoProps {
  address: string;
}

export function ImovelLocalizacao({ address }: ImovelLocalizacaoProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    if (!isLoaded || !address) return;

    const geocoder = new window.google.maps.Geocoder();
    
    console.log('Tentando geocodificar endereço:', address);

    geocoder.geocode({
      address: address,
      region: 'BR',
    }, (results, status) => {
      console.log('Status da geocodificação:', status);
      console.log('Resultados:', results);

      if (status === 'OK' && results?.[0]) {
        const loc = results[0].geometry.location;
        const newLocation = {
          lat: loc.lat(),
          lng: loc.lng()
        };
        
        console.log('Nova localização encontrada:', newLocation);
        setLocation(newLocation);
        setGeocodeError(null);
      } else {
        console.error('Erro na geocodificação:', status);
        setGeocodeError(`Não foi possível localizar o endereço (${status})`);
        setLocation(null);
      }
    });
  }, [isLoaded, address]);

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localização</h3>
            <div className="w-full h-[400px] rounded-lg overflow-hidden flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadError || geocodeError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localização</h3>
            <div className="w-full h-[400px] rounded-lg overflow-hidden flex items-center justify-center text-red-500">
              <div className="text-center">
                <p>{loadError?.message || geocodeError || 'Erro ao carregar o mapa'}</p>
                <p className="text-sm mt-2">{address}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{address}</p>
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
          <div className="space-y-2">
            <GoogleMapComponent
              center={location}
              markers={location ? [location] : []}
              className="w-full h-[400px] rounded-lg overflow-hidden"
              zoom={16}
            />
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}