import { PropertyData } from "@/types/property";
import { useEffect, useState } from "react";
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
        // Se não tiver endereço completo, não gere o mapa
        if (!property.street_address || !property.neighborhood || !property.city) {
          console.log('Endereço incompleto, não gerando mapa');
          return;
        }

        console.log('Iniciando processo de geração do mapa...');
        
        // Gerar URL do mapa com o endereço completo
        const address = encodeURIComponent(
          `${property.street_address}, ${property.neighborhood}, ${property.city}`
        );
        
        // Usar a chave da API diretamente do ambiente
        const API_KEY = 'AIzaSyD2YrShNdcMn4mCDeaB4MB4EtPYjRDsrXI';
        console.log('Usando chave da API para gerar URL do mapa');
        
        const url = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${address}`;
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