import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormData } from "@/types/property";

export const usePropertyForm = (initialData: PropertyFormData) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>(initialData);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "bedrooms" ||
        name === "bathrooms" ||
        name === "parking_spaces" ||
        name === "total_area"
          ? Number(value)
          : value,
    }));
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-property-description",
        {
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
        }
      );

      if (error) throw error;

      if (data?.description) {
        setFormData((prev) => ({ ...prev, description: data.description }));
        toast({
          title: "Sucesso!",
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
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para realizar esta operação.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
        return;
      }

      const propertyData = {
        ...formData,
        agent_id: user.id,
        features: formData.features || {},
      };

      const { error } = !formData.id
        ? await supabase
            .from("properties")
            .insert([propertyData])
            .select()
            .single()
        : await supabase
            .from("properties")
            .update(propertyData)
            .eq("id", formData.id)
            .select()
            .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: formData.id
          ? "Imóvel atualizado com sucesso!"
          : "Imóvel criado com sucesso!",
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o imóvel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isGeneratingDescription,
    handleInputChange,
    generateDescription,
    handleSubmit,
  };
};