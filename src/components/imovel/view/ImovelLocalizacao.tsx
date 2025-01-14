import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImovelLocalizacaoProps {
  address: string;
}

interface GoogleMapsWindow extends Window {
  google?: any;
}

declare const window: GoogleMapsWindow;

export function ImovelLocalizacao({ address }: ImovelLocalizacaoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    async function loadGoogleMaps() {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: apiKey, error } = await supabase
          .rpc('secrets', { secret_name: 'GOOGLE_MAPS_API_KEY' });

        if (error || !apiKey) {
          throw new Error('Erro ao carregar a chave da API do Google Maps');
        }

        if (!document.getElementById('google-maps-script')) {
          const script = document.createElement('script');
          script.id = 'google-maps-script';
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            initMap();
          };

          script.onerror = () => {
            console.error('Erro ao carregar o Google Maps');
            toast.error('Erro ao carregar o Google Maps');
            setIsLoading(false);
          };

          document.head.appendChild(script);
        } else if (window.google) {
          initMap();
        }
      } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        toast.error('Erro ao carregar o mapa');
        setIsLoading(false);
      }
    }

    function initMap() {
      if (!mapRef.current || !window.google) return;

      const defaultLocation = { lat: -16.6869, lng: -49.2648 }; // Goiânia
      
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const geocoder = new window.google.maps.Geocoder();

      if (address) {
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location;
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter(location);
              
              if (markerRef.current) {
                markerRef.current.setMap(null);
              }
              
              markerRef.current = new window.google.maps.Marker({
                map: mapInstanceRef.current,
                position: location,
                animation: window.google.maps.Animation.DROP,
              });
            }
          } else {
            console.warn('Não foi possível localizar o endereço:', address);
            toast.error('Não foi possível localizar o endereço no mapa');
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapInstanceRef.current = null;
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