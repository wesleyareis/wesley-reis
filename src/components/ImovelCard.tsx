import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImovelCardImage } from "./imovel/card/ImovelCardImage";
import { ImovelCardFeatures } from "./imovel/card/ImovelCardFeatures";
import { ImovelCardActions } from "./imovel/card/ImovelCardActions";
import { toast } from "sonner";

interface ImovelCardProps {
  id: string;
  property_code: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  imageUrl: string;
  agent_id?: string;
}

export function ImovelCard({
  id,
  property_code,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  parkingSpaces,
  area,
  imageUrl,
  agent_id,
}: ImovelCardProps) {
  const [isAgent, setIsAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfAgent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAgent(!!user && user.id === agent_id);
    };
    checkIfAgent();
  }, [agent_id]);

  const handleEditClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!property) {
        toast.error("Imóvel não encontrado");
        return;
      }

      navigate(`/imovel/editar/${property_code}`, {
        state: { property }
      });
    } catch (error) {
      console.error('Erro ao buscar dados do imóvel:', error);
      toast.error("Erro ao carregar dados do imóvel");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/imovel/${property_code}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <ImovelCardImage imageUrl={imageUrl} title={title} price={price} />
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{location}</p>
        <ImovelCardFeatures
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          parkingSpaces={parkingSpaces}
          area={area}
        />
      </CardContent>
      <ImovelCardActions
        propertyCode={property_code}
        isAgent={isAgent}
        onEditClick={handleEditClick}
        isLoading={isLoading}
      />
    </Card>
  );
}