import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyHeader } from "./view/PropertyHeader";
import { PropertyImages } from "./view/PropertyImages";
import { PropertyDetails } from "./view/PropertyDetails";
import { PropertyFeatures } from "./view/PropertyFeatures";
import { PropertyLocation } from "./view/PropertyLocation";
import { PropertyAgent } from "./view/PropertyAgent";
import { PropertyPrice } from "./view/PropertyPrice";

interface PropertyViewProps {
  property: PropertyData;
  canEdit: boolean;
}

export const PropertyView = ({ property, canEdit }: PropertyViewProps) => {
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
    <div className="min-h-screen bg-background">
      <PropertyHeader property={property} canEdit={canEdit} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <PropertyImages property={property} />

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <PropertyDetails property={property} />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <PropertyFeatures property={property} />
            <PropertyLocation property={property} />
          </div>

          <div className="space-y-6">
            <PropertyPrice property={property} />
            {agent && (
              <PropertyAgent 
                agent={agent}
                propertyUrl={window.location.href}
                onWhatsAppClick={() => {}} // Não é mais necessário pois o componente agora gerencia seu próprio clique
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};