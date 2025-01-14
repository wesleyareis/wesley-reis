import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyData } from "@/types/imovel";
import { Loader2 } from "lucide-react";

interface ImovelLocalizacaoProps {
  property: PropertyData;
}

export const ImovelLocalizacao = ({ property }: ImovelLocalizacaoProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleMapsKey, setGoogleMapsKey] = useState<string | null>(null);

  const address = property.street_address 
    ? `${property.street_address} - ${property.neighborhood}, ${property.city}`
    : `${property.neighborhood}, ${property.city}`;

  useEffect(() => {
    const loadGoogleMapsKey = async () => {
      try {
        const { data, error } = await supabase.rpc('secrets', {
          secret_name: 'GOOGLE_MAPS_API_KEY'
        });

        if (error) throw error;
        setGoogleMapsKey(data);
      } catch (error) {
        console.error('Erro ao carregar chave do Google Maps:', error);
      }
    };

    loadGoogleMapsKey();
  }, []);

  useEffect(() => {
    if (!googleMapsKey || !mapRef.current) return;

    const loadGoogleMaps = async () => {
      try {
        // Carrega o script do Google Maps
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = async () => {
          // Inicializa o geocoder
          const geocoder = new google.maps.Geocoder();
          
          // Geocodifica o endereço
          const result = await new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                resolve(results[0]);
              } else {
                reject(new Error('Não foi possível encontrar o endereço'));
              }
            });
          });

          // Cria o mapa
          const map = new google.maps.Map(mapRef.current, {
            zoom: 15,
            center: (result as google.maps.GeocoderResult).geometry.location,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          // Adiciona o marcador
          new google.maps.Marker({
            map,
            position: (result as google.maps.GeocoderResult).geometry.location,
            animation: google.maps.Animation.DROP,
          });

          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Erro ao carregar o mapa:', error);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
      // Remove o script ao desmontar o componente
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        script.remove();
      }
    };
  }, [address, googleMapsKey]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg overflow-hidden shadow-sm bg-background relative"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground text-center">
        {address}
      </p>
    </div>
  );
};