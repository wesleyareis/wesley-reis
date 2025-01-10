import { PropertyData } from "@/types/property";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyLocationProps {
  property: PropertyData;
}

export const PropertyLocation = ({ property }: PropertyLocationProps) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateMapUrl = async () => {
      try {
        // Se já tiver uma URL do mapa e ela for do formato embed, use-a
        if (property.map_url && property.map_url.includes('maps/embed')) {
          setMapUrl(property.map_url);
          return;
        }

        // Se não tiver endereço completo, não gere o mapa
        if (!property.street_address || !property.neighborhood || !property.city) {
          return;
        }

        // Buscar a chave da API do Google Maps
        const { data: { secret } } = await supabase.rpc('secrets', {
          name: 'GOOGLE_MAPS_API_KEY'
        });

        if (!secret) {
          console.error('Google Maps API key não encontrada');
          return;
        }

        // Gerar URL do mapa com o endereço completo
        const address = encodeURIComponent(
          `${property.street_address}, ${property.neighborhood}, ${property.city}`
        );
        
        const url = `https://www.google.com/maps/embed/v1/place?key=${secret}&q=${address}`;
        setMapUrl(url);

      } catch (error) {
        console.error('Erro ao gerar URL do mapa:', error);
      }
    };

    generateMapUrl();
  }, [property]);

  // Se não houver endereço, não exiba nada
  if (!property.street_address && !property.neighborhood && !property.city) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      
      {mapUrl ? (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do imóvel"
          />
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-muted-foreground">Mapa não disponível</p>
        </div>
      )}

      <div className="mt-2 text-sm text-muted-foreground">
        {property.street_address && <p>{property.street_address}</p>}
        <p>{property.neighborhood}, {property.city}</p>
      </div>
    </div>
  );
};