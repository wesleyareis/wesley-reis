import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/imovel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from 'react-helmet-async';
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
        .maybeSingle();
      return data;
    },
    enabled: !!property.agent_id
  });

  const handleWhatsAppClick = () => {
    if (agent?.whatsapp_url) {
      const message = encodeURIComponent(
        `Olá! Vi o imóvel ${property.title} (código: ${property.property_code}) e gostaria de mais informações.`
      );
      const whatsappUrl = `${agent.whatsapp_url}${agent.whatsapp_url.includes('?') ? '&' : '?'}text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const mainImage = property.images?.[0] || "https://kjlipbbrbwdzqiwvrnpw.supabase.co/storage/v1/object/public/property-images/og-image.png";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{property.title} - Wesley Reis Imóveis</title>
        <meta name="description" content={property.description?.slice(0, 155) || `${property.title} - Imóvel à venda em ${property.neighborhood}, ${property.city}`} />
        <meta property="og:title" content={`${property.title} - Wesley Reis Imóveis`} />
        <meta property="og:description" content={property.description?.slice(0, 155) || `${property.title} - Imóvel à venda em ${property.neighborhood}, ${property.city}`} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

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
                onWhatsAppClick={handleWhatsAppClick}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};