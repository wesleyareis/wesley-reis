import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Declaração explícita dos tipos do Google Maps
declare global {
  interface Window {
    google: typeof google;
  }
}

interface ImovelLocalizacaoProps {
  address: string;
}

export function ImovelLocalizacao({ address }: ImovelLocalizacaoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultLocation = { lat: -16.6869, lng: -49.2648 }; // Goiânia

  useEffect(() => {
    let mapInstance: google.maps.Map | null = null;
    let marker: google.maps.Marker | null = null;

    const initializeMap = (apiKey: string) => {
      if (!mapRef.current) return;

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (!mapRef.current) return;

        mapInstance = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: defaultLocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const geocoder = new window.google.maps.Geocoder();

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

      script.onerror = () => {
        console.error('Erro ao carregar o Google Maps');
        toast.error('Erro ao carregar o mapa');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const setupMap = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: apiKey, error } = await supabase.rpc('secrets', { 
          secret_name: 'GOOGLE_MAPS_API_KEY' 
        });

        if (error || !apiKey) {
          throw new Error('Erro ao carregar a chave da API do Google Maps');
        }

        initializeMap(apiKey);
      } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        toast.error('Erro ao carregar o mapa');
        setIsLoading(false);
      }
    };

    setupMap();

    return () => {
      if (marker) {
        marker.setMap(null);
      }
      mapInstance = null;
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