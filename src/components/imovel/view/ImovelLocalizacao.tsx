import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  address?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function ImovelLocalizacao({ address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initMap = async (apiKey: string) => {
      if (!mapRef.current) return;

      const defaultLocation = { lat: -16.6869, lng: -49.2648 }; // Goiânia

      const createMap = () => {
        if (!mapRef.current) return;
        
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: defaultLocation,
          mapTypeControl: false,
        });

        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: defaultLocation,
        });

        if (address) {
          const geocoder = new window.google.maps.Geocoder();
          
          geocoder.geocode({ address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
            if (status === 'OK' && results?.[0]) {
              const location = results[0].geometry.location;
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setCenter(location);
                if (markerRef.current) {
                  markerRef.current.setPosition(location);
                }
              }
            } else {
              console.error('Geocode não foi bem sucedido:', status);
              toast({
                title: "Erro",
                description: "Não foi possível localizar o endereço no mapa",
                variant: "destructive"
              });
            }
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      };

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
          toast({
            title: "Erro",
            description: "Erro ao carregar o mapa",
            variant: "destructive"
          });
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } else {
        createMap();
      }
    };

    const loadGoogleMapsKey = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('secrets', {
          secret_name: 'GOOGLE_MAPS_API_KEY'
        });

        if (error) throw error;
        if (data) {
          await initMap(data);
        }
      } catch (error) {
        console.error('Erro ao carregar chave do Google Maps:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar o mapa",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    loadGoogleMapsKey();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapInstanceRef.current) {
        const node = mapRef.current;
        if (node) {
          while (node.firstChild) {
            node.removeChild(node.firstChild);
          }
        }
      }
    };
  }, [address, toast]);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '400px',
            position: 'relative'
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}