import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/imovel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImovelHeader } from "./view/ImovelHeader";
import { ImovelImagens } from "./view/ImovelImagens";
import { ImovelDetalhes } from "./view/ImovelDetalhes";
import { ImovelCaracteristicas } from "./view/ImovelCaracteristicas";
import { ImovelLocalizacao } from "./view/ImovelLocalizacao";
import { ImovelCorretor } from "./view/ImovelCorretor";
import { ImovelPreco } from "./view/ImovelPreco";
import { Footer } from "../Footer";

interface ImovelViewProps {
  property: PropertyData;
  canEdit: boolean;
}

export const ImovelView = ({ property, canEdit }: ImovelViewProps) => {
  const { data: agent } = useQuery({
    queryKey: ['agent', property.agent_id],
    queryFn: async () => {
      if (!property.agent_id) return null;
      const { data } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', property.agent_id)
        .single();
      return data;
    },
    enabled: !!property.agent_id
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ImovelHeader property={property} canEdit={canEdit} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <ImovelImagens property={property} />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <ImovelDetalhes property={property} />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <ImovelCaracteristicas property={property} />
            <ImovelLocalizacao property={property} />
          </div>

          <div className="space-y-6">
            <ImovelPreco property={property} />
            {agent && (
              <ImovelCorretor 
                agent={agent}
                propertyUrl={window.location.href}
                onWhatsAppClick={() => {}}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};