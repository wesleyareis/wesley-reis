import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImovelLocalizacaoProps {
  address: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export function ImovelLocalizacao({ address }: ImovelLocalizacaoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = (apiKey: string) => {
      if (!mapRef.current) return;

      const defaultLocation = { lat: -16.6869, lng: -49.2648 }; // Goiânia

      const loadGoogleMaps = () => {
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.id = 'google-maps-script';
          
          script.onload = () => {
            console.log('Google Maps carregado com sucesso');
            createMap();
          };

          script.onerror = () => {
            console.error('Erro ao carregar Google Maps');
            toast.error('Erro ao carregar o mapa');
            setIsLoading(false);
          };

          document.head.appendChild(script);
        } else {
          createMap();
        }
      };

      const createMap = () => {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current!, {
          zoom: 15,
          center: defaultLocation,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        if (address) {
          const geocoder = new window.google.maps.Geocoder();
          
          geocoder.geocode({ address }, (results: any, status: any) => {
            if (status === 'OK' && results?.[0]) {
              const location = results[0].geometry.location;
              mapInstanceRef.current?.setCenter(location);
              
              if (markerRef.current) {
                markerRef.current.setMap(null);
              }
              
              markerRef.current = new window.google.maps.Marker({
                map: mapInstanceRef.current!,
                position: location,
                animation: window.google.maps.Animation.DROP,
              });
            } else {
              console.warn('Endereço não localizado:', address);
              toast.error('Não foi possível localizar o endereço no mapa');
            }
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      };

      loadGoogleMaps();
    };

    const loadGoogleMapsKey = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: apiKey, error } = await supabase
          .rpc('secrets', { secret_name: 'GOOGLE_MAPS_API_KEY' });

        if (error || !apiKey) {
          throw new Error('Erro ao carregar a chave da API');
        }

        console.log('Inicializando mapa com endereço:', address);
        initMap(apiKey);
      } catch (error) {
        console.error('Erro ao inicializar mapa:', error);
        toast.error('Erro ao carregar o mapa');
        setIsLoading(false);
      }
    };

    loadGoogleMapsKey();

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