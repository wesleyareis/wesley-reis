import { PropertyData } from "@/types/imovel";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImovelLocalizacaoProps {
  property: PropertyData;
}

export const ImovelLocalizacao = ({ property }: ImovelLocalizacaoProps) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateMapUrl = async () => {
      try {
        setMapError(false);

        if (!property.street_address || !property.neighborhood || !property.city) {
          console.log('Endereço incompleto, não gerando mapa');
          return;
        }

        console.log('Iniciando processo de geração do mapa...');
        
        const address = encodeURIComponent(
          `${property.street_address}, ${property.neighborhood}, ${property.city}`
        );
        
        const API_KEY = 'AIzaSyD2YrShNdcMn4mCDeaB4MB4EtPYjRDsrXI';
        console.log('Usando chave da API para gerar URL do mapa');
        
        const url = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${address}&language=pt-BR`;
        console.log('URL do mapa gerada com sucesso');
        setMapUrl(url);

      } catch (error) {
        console.error('Erro ao gerar URL do mapa:', error);
        setMapError(true);
        toast({
          title: "Erro ao carregar mapa",
          description: "Não foi possível gerar o mapa do endereço. Por favor, desative o bloqueador de anúncios se estiver usando.",
          variant: "destructive",
        });
      }
    };

    generateMapUrl();
  }, [property, toast]);

  if (!property.street_address && !property.neighborhood && !property.city) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      
      {mapUrl && !mapError ? (
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
            onError={() => setMapError(true)}
          />
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-muted-foreground">
            {mapError 
              ? "Não foi possível carregar o mapa. Por favor, desative o bloqueador de anúncios se estiver usando."
              : "Mapa não disponível"}
          </p>
        </div>
      )}

      <div className="mt-2 text-sm text-muted-foreground">
        {property.street_address && <p>{property.street_address}</p>}
        <p>{property.neighborhood}, {property.city}</p>
      </div>
    </div>
  );
};