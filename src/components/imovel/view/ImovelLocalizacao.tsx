import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImovelLocalizacaoProps {
  address: string;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export function ImovelLocalizacao({ address }: ImovelLocalizacaoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mapInstance: google.maps.Map | null = null;
    let geocoder: google.maps.Geocoder | null = null;
    let marker: google.maps.Marker | null = null;

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const defaultLocation = { lat: -16.6869, lng: -49.2648 }; // Goiânia
      
      mapInstance = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: defaultLocation,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      geocoder = new window.google.maps.Geocoder();

      if (address) {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location;
            mapInstance?.setCenter(location);
            
            if (marker) {
              marker.setMap(null);
            }
            
            marker = new window.google.maps.Marker({
              map: mapInstance,
              position: location,
              animation: window.google.maps.Animation.DROP,
            });
          } else {
            console.warn('Não foi possível localizar o endereço:', address);
            toast.error('Não foi possível localizar o endereço no mapa');
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    };

    const loadGoogleMaps = async () => {
      try {
        if (!address) {
          setIsLoading(false);
          return;
        }

        const { data: secrets, error } = await supabase
          .rpc('secrets', { secret_name: 'GOOGLE_MAPS_API_KEY' });

        if (error || !secrets) {
          throw new Error('Erro ao carregar a chave da API do Google Maps');
        }

        if (!document.getElementById('google-maps-script')) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${secrets}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.id = 'google-maps-script';
          
          script.onload = () => {
            initMap();
          };

          script.onerror = () => {
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
    };

    loadGoogleMaps();

    return () => {
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