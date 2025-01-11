import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyFormData } from "@/types/imovel";
import { ImovelView } from "@/components/imovel/ImovelView";
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const ImovelDetalhe = () => {
  const { property_code } = useParams();
  const { toast } = useToast();
  const location = useLocation();
  const isNewProperty = !property_code;
  const isEditMode = isNewProperty || window.location.pathname.includes("/editar/");

  // Verifica autenticação apenas quando estiver em modo de edição
  useAuthCheck(isEditMode);

  // Busca dados do imóvel
  const { data: property, isLoading: isLoadingProperty, isError } = useQuery({
    queryKey: ["property", property_code],
    queryFn: async () => {
      if (isNewProperty) return null;

      // Se os dados foram passados via state na navegação, use-os
      if (location.state?.property) {
        return location.state.property;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("property_code", property_code)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar imóvel:", error);
        toast({
          title: "Erro ao carregar imóvel",
          description: "Não foi possível carregar os dados do imóvel.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !isNewProperty,
    retry: false,
    initialData: location.state?.property // Usa os dados do state como valor inicial
  });

  // Busca dados do usuário atual
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    enabled: isEditMode, // Busca usuário apenas em modo de edição
  });

  const canEdit = isNewProperty || (property && currentUser && property.agent_id === currentUser.id);

  const initialData: PropertyFormData = property || {
    title: "",
    price: 0,
    description: "",
    property_type: "",
    bedrooms: 0,
    bathrooms: 0,
    parking_spaces: 0,
    total_area: 0,
    city: "",
    neighborhood: "",
    street_address: "",
    features: {},
  };

  const {
    formData,
    isLoading: isLoadingForm,
    isGeneratingDescription,
    handleInputChange,
    generateDescription,
    handleSubmit,
  } = usePropertyForm(initialData);

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar o imóvel</p>
      </div>
    );
  }

  if (!isNewProperty && !property && !isEditMode) {
    return <div>Carregando...</div>;
  }

  if (isEditMode && isLoadingProperty) {
    return <div>Carregando...</div>;
  }

  if (isEditMode) {
    return (
      <ImovelEdit
        formData={formData}
        isLoading={isLoadingForm}
        isGeneratingDescription={isGeneratingDescription}
        onInputChange={handleInputChange}
        onGenerateDescription={generateDescription}
        onSubmit={handleSubmit}
      />
    );
  }

  return property ? <ImovelView property={property} canEdit={canEdit} /> : null;
};

export default ImovelDetalhe;