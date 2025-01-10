import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImovelView } from "@/components/imovel/ImovelView";
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { PropertyFormData } from "@/types/imovel";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ImovelDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNewProperty = !id || id === "novo";
  const isEditMode = isNewProperty || window.location.pathname.includes("/editar/");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user && isEditMode) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate, toast, isEditMode]);

  const { data: property, isLoading: isLoadingProperty, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (isNewProperty) return null;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
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
    retry: false
  });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
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
    return <LoadingSpinner />;
  }

  if (isEditMode && isLoadingProperty) {
    return <LoadingSpinner />;
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