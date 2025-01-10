import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyView } from "@/components/property/PropertyView";
import { PropertyEdit } from "@/components/property/PropertyEdit";
import type { PropertyFormData } from "@/types/property";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
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
    images: [],
    features: {},
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    checkUser();
  }, []);

  const { data: property } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id || id === "new") return null;
      
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
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

  const isEditMode = window.location.pathname.includes('/edit/');
  const canEdit = id === "new" || (property && currentUser && property.agent_id === currentUser);

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        features: property.features as Record<string, any> || {},
      });
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "bedrooms" || name === "bathrooms" || 
              name === "parking_spaces" || name === "total_area" 
              ? Number(value) : value
    }));
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-property-description", {
        body: {
          propertyDetails: {
            type: formData.property_type,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            parkingSpaces: formData.parking_spaces,
            area: formData.total_area,
            location: `${formData.neighborhood}, ${formData.city}`,
          },
        },
      });

      if (error) throw error;

      if (data?.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
        toast({
          title: "Descrição gerada com sucesso!",
          description: "A descrição do imóvel foi atualizada.",
        });
      }
    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      toast({
        title: "Erro ao gerar descrição",
        description: "Não foi possível gerar a descrição do imóvel.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const propertyData = {
        ...formData,
        agent_id: user.id,
        features: formData.features || {},
      };

      let result;
      if (id === "new") {
        result = await supabase
          .from("properties")
          .insert([propertyData])
          .select()
          .single();
      } else {
        result = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", id)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Sucesso!",
        description: id === "new" ? "Imóvel criado com sucesso!" : "Imóvel atualizado com sucesso!",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o imóvel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!property && id !== "new") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isEditMode && !canEdit) {
    navigate(`/property/${id}`);
    return null;
  }

  if (isEditMode || id === "new") {
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

  return property ? (
    <PropertyView property={property} canEdit={canEdit} />
  ) : null;
};

export default PropertyDetail;