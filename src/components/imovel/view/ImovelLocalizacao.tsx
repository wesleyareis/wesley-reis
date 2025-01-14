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
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode({ address }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
              const map = new google.maps.Map(mapRef.current!, {
                zoom: 15,
                center: results[0].geometry.location,
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

              new google.maps.Marker({
                map,
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP,
              });

              setIsLoading(false);
            } else {
              console.error('Erro ao geocodificar endereço:', status);
              setIsLoading(false);
            }
          });
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Erro ao carregar o mapa:', error);
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    return () => {
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