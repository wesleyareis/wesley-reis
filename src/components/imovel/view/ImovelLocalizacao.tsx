import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useGoogleMapsKey } from "@/hooks/useGoogleMapsKey";

interface ImovelLocalizacaoProps {
  address: string;
  neighborhood: string;
  city: string;
}

export function ImovelLocalizacao({ address, neighborhood, city }: ImovelLocalizacaoProps) {
  const { key, isLoading } = useGoogleMapsKey();
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);

  useEffect(() => {
    const generateMapUrl = async () => {
      try {
        setMapError(false);

        console.log('Dados para geração do mapa:', {
          temEndereco: !!address,
          temBairro: !!neighborhood,
          temCidade: !!city,
          temChaveAPI: !!key
        });

        if (!address || !neighborhood || !city || !key) {
          console.log('Dados incompletos, não gerando mapa:', {
            address,
            neighborhood,
            city,
            hasKey: !!key
          });
          return;
        }

        console.log('Iniciando processo de geração do mapa...');
        
        const fullAddress = encodeURIComponent(
          `${address}, ${neighborhood}, ${city}, Brasil`
        );
        
        console.log('Usando chave da API para gerar URL do mapa');
        
        const url = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${fullAddress}&language=pt-BR`;
        console.log('URL do mapa gerada com sucesso');
        setMapUrl(url);

      } catch (error) {
        console.error('Erro ao gerar URL do mapa:', error);
        setMapError(true);
        toast.error("Não foi possível carregar o mapa. Por favor, tente novamente mais tarde.");
      }
    };

    generateMapUrl();
  }, [address, neighborhood, city, key]);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!address || !neighborhood || !city) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Localização</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mapUrl && !mapError ? (
              <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
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
                    ? "Não foi possível carregar o mapa. Por favor, tente novamente mais tarde."
                    : "Mapa não disponível"}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {`${address}, ${neighborhood}, ${city}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}