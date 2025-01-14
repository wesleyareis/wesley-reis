import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImovelLocalizacaoProps {
  address: string;
}

export function ImovelLocalizacao({ address }: ImovelLocalizacaoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    let mapInstance: google.maps.Map | null = null;
    let geocoder: google.maps.Geocoder | null = null;
    let marker: google.maps.Marker | null = null;

    const initializeMap = async () => {
      try {
        const { data: secrets, error } = await supabase
          .rpc('secrets', { secret_name: 'GOOGLE_MAPS_API_KEY' });

        if (error || !secrets) {
          throw new Error('Erro ao carregar a chave da API do Google Maps');
        }

        const apiKey = secrets;
        
        // Carrega o script do Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.id = 'google-maps-script';
        
        script.onload = () => {
          setGoogleMapsLoaded(true);
          initMap();
        };

        script.onerror = () => {
          toast.error('Erro ao carregar o Google Maps');
          setIsLoading(false);
        };

        document.head.appendChild(script);

        const initMap = () => {
          if (!mapRef.current) return;

          const defaultLocation = { lat: -23.5505, lng: -46.6333 }; // São Paulo
          
          mapInstance = new google.maps.Map(mapRef.current, {
            zoom: 15,
            center: defaultLocation,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          geocoder = new google.maps.Geocoder();

          if (address) {
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const location = results[0].geometry.location;
                mapInstance?.setCenter(location);
                
                if (marker) {
                  marker.setMap(null);
                }
                
                marker = new google.maps.Marker({
                  map: mapInstance,
                  position: location,
                  animation: google.maps.Animation.DROP,
                });
              } else {
                toast.error('Não foi possível localizar o endereço no mapa');
              }
              setIsLoading(false);
            });
          } else {
            setIsLoading(false);
          }
        };

      } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        toast.error('Erro ao carregar o mapa');
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      // Limpa o script e instâncias do Google Maps
      const script = document.getElementById('google-maps-script');
      if (script) {
        script.remove();
      }
      if (marker) {
        marker.setMap(null);
      }
      if (mapInstance) {
        // @ts-ignore
        mapInstance = null;
      }
    };
  }, [address]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Localização</h3>
          <div 
            ref={mapRef} 
            className="w-full h-[400px] rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center' 
            }}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}