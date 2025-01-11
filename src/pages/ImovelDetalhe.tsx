import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { ImovelView } from "@/components/imovel/ImovelView";
import { PropertyFormData } from "@/types/imovel";

export default function ImovelDetalhe() {
  const { property_code } = useParams();
  const [searchParams] = useSearchParams();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getProperty = async () => {
      const { data: property } = await supabase
        .from("properties")
        .select("*")
        .eq("property_code", property_code)
        .single();

      const { data: { user } } = await supabase.auth.getUser();

      setProperty(property);
      setUser(user);
      setIsLoading(false);
    };

    getProperty();
  }, [property_code]);

  if (isLoading || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAgent = user?.id === property.agent_id;
  const isEditMode = searchParams.get('mode') === 'edit' && isAgent;

  const initialFormData: PropertyFormData = {
    ...property,
    features: property.features || {},
  };

  return (
    <div className="min-h-screen bg-background">
      {isEditMode ? (
        <ImovelEdit 
          formData={initialFormData}
          isLoading={false}
          isGeneratingDescription={false}
          onInputChange={() => {}}
          onGenerateDescription={async () => {}}
          onSubmit={async () => {}}
        />
      ) : (
        <ImovelView 
          property={property}
          canEdit={isAgent}
        />
      )}
    </div>
  );
}