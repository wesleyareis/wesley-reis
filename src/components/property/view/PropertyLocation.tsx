import { PropertyData } from "@/types/property";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PropertyLocationProps {
  property: PropertyData;
}

export const PropertyLocation = ({ property }: PropertyLocationProps) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const generateMapUrl = async () => {
      try {
        // Se já tiver uma URL do mapa e ela for do formato embed, use-a
        if (property.map_url && property.map_url.includes('maps/embed')) {
          console.log('Usando URL do mapa existente:', property.map_url);
          setMapUrl(property.map_url);
          return;
        }

        // Se não tiver endereço completo, não gere o mapa
        if (!property.street_address || !property.neighborhood || !property.city) {
          console.log('Endereço incompleto, não gerando mapa');
          return;
        }

        console.log('Buscando chave da API do Google Maps...');
        
        // Buscar a chave da API do Google Maps
        const { data: secretData, error: secretError } = await supabase.rpc('secrets', {
          secret_name: 'GOOGLE_MAPS_API_KEY'
        });

        if (secretError) {
          console.error('Erro ao buscar chave da API:', secretError);
          throw secretError;
        }

        if (!secretData?.secret) {
          console.error('Chave da API do Google Maps não encontrada');
          toast({
            title: "Erro ao carregar mapa",
            description: "Chave da API do Google Maps não configurada.",
            variant: "destructive",
          });
          return;
        }

        console.log('Chave da API encontrada, gerando URL do mapa...');

        // Gerar URL do mapa com o endereço completo
        const address = encodeURIComponent(
          `${property.street_address}, ${property.neighborhood}, ${property.city}`
        );
        
        const url = `https://www.google.com/maps/embed/v1/place?key=${secretData.secret}&q=${address}`;
        console.log('URL do mapa gerada com sucesso');
        setMapUrl(url);

      } catch (error) {
        console.error('Erro ao gerar URL do mapa:', error);
        toast({
          title: "Erro ao carregar mapa",
          description: "Não foi possível gerar o mapa do endereço.",
          variant: "destructive",
        });
      }
    };

    generateMapUrl();
  }, [property, toast]);

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