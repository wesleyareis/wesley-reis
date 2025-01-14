import { PropertyData } from "@/types/imovel";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ImovelLocalizacaoProps {
  property: PropertyData;
}

export function ImovelLocalizacao({ property }: ImovelLocalizacaoProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      const address = `${property.street_address}, ${property.neighborhood}, ${property.city}`;
      
      try {
        const { data, error } = await supabase.functions.invoke('geocode', {
          body: { address }
        });

        if (error) throw error;

        if (data?.location && typeof google !== 'undefined' && mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: data.location,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          
          new google.maps.Marker({
            position: data.location,
            map,
            title: property.title
          });

          setMapLoaded(true);
        }
      } catch (error) {
        console.error("Erro ao carregar o mapa:", error);
      }
    };

    if (window.google && mapRef.current && !mapLoaded) {
      loadMap();
    }
  }, [property, mapLoaded]);

  if (!property.street_address || !property.neighborhood || !property.city) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <div 
        ref={mapRef} 
        className="w-full h-[300px] rounded-lg overflow-hidden shadow-sm"
      />
      <p className="mt-2 text-sm text-muted-foreground">
        {property.street_address} - {property.neighborhood}, {property.city}
      </p>
    </div>
  );
}