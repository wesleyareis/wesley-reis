import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyData } from "@/types/imovel";

interface ImovelLocalizacaoProps {
  property: PropertyData;
}

export const ImovelLocalizacao = ({ property }: ImovelLocalizacaoProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const address = `${property.street_address || ''} - ${property.neighborhood}, ${property.city}`;

  useEffect(() => {
    const loadMap = async () => {
      try {
        const { data, error } = await supabase
          .rpc('secrets', { secret_name: 'GOOGLE_MAPS_API_KEY' });

        if (error) {
          console.error("Erro ao carregar a chave da API:", error);
          return;
        }

        if (mapRef.current && !mapLoaded) {
          // Exibe o endereço formatado em um container estilizado
          const addressElement = document.createElement('div');
          addressElement.className = 'p-4 bg-muted rounded-lg text-center';
          addressElement.innerHTML = `
            <p class="font-medium mb-2">Endereço do Imóvel:</p>
            <p>${address}</p>
          `;
          
          if (mapRef.current.firstChild) {
            mapRef.current.removeChild(mapRef.current.firstChild);
          }
          mapRef.current.appendChild(addressElement);
          setMapLoaded(true);
        }
      } catch (error) {
        console.error("Erro ao carregar a localização:", error);
      }
    };

    if (mapRef.current && !mapLoaded) {
      loadMap();
    }
  }, [address, mapLoaded]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <div 
        ref={mapRef} 
        className="w-full min-h-[200px] rounded-lg overflow-hidden shadow-sm bg-background flex items-center justify-center"
      />
      <p className="mt-4 text-sm text-muted-foreground text-center">
        {property.street_address} - {property.neighborhood}, {property.city}
      </p>
    </div>
  );
};