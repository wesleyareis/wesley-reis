import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PropertyFormData } from "@/types/imovel";

export const usePropertyForm = (initialData: PropertyFormData) => {
  const [formData, setFormData] = useState<PropertyFormData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateDescription = async () => {
    try {
      setIsGeneratingDescription(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const response = await fetch(
        "https://kjlipbbrbwdzqiwvrnpw.supabase.co/functions/v1/generate-property-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            property: {
              ...formData,
              agent_id: user.id,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao gerar descrição");
      }

      const { description } = await response.json();
      setFormData((prev) => ({
        ...prev,
        description,
      }));

      toast({
        title: "Sucesso!",
        description: "Descrição gerada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a descrição.",
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
        throw new Error("Usuário não autenticado");
      }

      const propertyData = {
        ...formData,
        agent_id: user.id,
      };

      let operation;
      if (formData.property_code) {
        // Atualização
        operation = supabase
          .from("properties")
          .update(propertyData)
          .eq("property_code", formData.property_code);
      } else {
        // Inserção
        operation = supabase
          .from("properties")
          .insert(propertyData);
      }

      const { error, data } = await operation;

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: formData.property_code
          ? "Imóvel atualizado com sucesso!"
          : "Imóvel criado com sucesso!",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o imóvel.",
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