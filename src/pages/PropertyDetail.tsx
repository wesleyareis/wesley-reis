import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyView } from "@/components/property/PropertyView";
import { PropertyEdit } from "@/components/property/PropertyEdit";
import { usePropertyForm } from "@/hooks/usePropertyForm";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id === "new" || window.location.pathname.includes("/edit/");

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user && isEditMode) {
        toast({
          title: "Acesso negado",
          description: "Você precisa estar logado para acessar esta página.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, toast, isEditMode]);

  // Buscar dados do imóvel
  const { data: property, isError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id || id === "new") return null;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Erro ao carregar imóvel",
          description: "Não foi possível carregar os dados do imóvel.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!id && id !== "new",
  });

  // Verificar permissão de edição
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const canEdit = id === "new" || (property && currentUser && property.agent_id === currentUser.id);

  // Usar o hook do formulário
  const {
    formData,
    isLoading,
    isGeneratingDescription,
    handleInputChange,
    generateDescription,
    handleSubmit,
  } = usePropertyForm(property);

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Erro ao carregar o imóvel</p>
      </div>
    );
  }

  if (!property && id !== "new" && !isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <PropertyEdit
        formData={formData}
        isLoading={isLoading}
        isGeneratingDescription={isGeneratingDescription}
        onInputChange={handleInputChange}
        onGenerateDescription={generateDescription}
        onSubmit={handleSubmit}
      />
    );
  }

  return property ? <PropertyView property={property} canEdit={canEdit} /> : null;
};

export default PropertyDetail;