import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyData } from "@/types/imovel";
import { Loader2 } from "lucide-react";

// Definindo tipos para o Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        Geocoder: typeof google.maps.Geocoder;
        GeocoderStatus: typeof google.maps.GeocoderStatus;
        Animation: typeof google.maps.Animation;
        NavigationControl: typeof google.maps.NavigationControl;
      };
    };
  }
}

interface ImovelLocalizacaoProps {
  property: PropertyData;
}

export const ImovelLocalizacao = ({ property }: ImovelLocalizacaoProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleMapsKey, setGoogleMapsKey] = useState<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

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
        setIsLoading(false);
      }
    };

    loadGoogleMapsKey();

    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!googleMapsKey || !mapRef.current) return;

    const loadGoogleMaps = () => {
      const googleMaps = window.google?.maps;
      if (googleMaps) {
        initializeMap();
        return;
      }

      scriptRef.current = document.createElement('script');
      scriptRef.current.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`;
      scriptRef.current.async = true;
      scriptRef.current.defer = true;
      scriptRef.current.onload = () => initializeMap();
      scriptRef.current.onerror = () => {
        console.error('Erro ao carregar o Google Maps');
        setIsLoading(false);
      };
      
      document.head.appendChild(scriptRef.current);
    };

    const initializeMap = () => {
      const googleMaps = window.google?.maps;
      if (!googleMaps || !mapRef.current) return;
      
      const geocoder = new googleMaps.Geocoder();
      
      geocoder.geocode({ address }, (results, status) => {
        if (status === googleMaps.GeocoderStatus.OK && results?.[0] && mapRef.current) {
          const map = new googleMaps.Map(mapRef.current, {
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

          new googleMaps.Marker({
            map,
            position: results[0].geometry.location,
            animation: googleMaps.Animation.DROP,
          });
        }
        setIsLoading(false);
      });
    };

    loadGoogleMaps();
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