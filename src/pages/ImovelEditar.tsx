import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { toast } from "sonner";
import type { PropertyFormData } from "@/types/imovel";

const EditarImovel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<PropertyFormData | null>(null);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (property) {
      setFormState({
        title: property.title,
        description: property.description || "",
        price: property.price,
        property_type: property.property_type,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        parking_spaces: property.parking_spaces || 0,
        total_area: property.total_area || 0,
        city: property.city,
        neighborhood: property.neighborhood,
        street_address: property.street_address || "",
        building_name: property.building_name || "",
        features: property.features || {},
        images: property.images || [],
        condominium_fee: property.condominium_fee || 0,
        property_tax: property.property_tax || 0,
      });
    }
  }, [property]);

  const mutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const { error } = await supabase
        .from("properties")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Imóvel atualizado com sucesso!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      toast.error("Erro ao atualizar imóvel. Tente novamente.");
    },
  });

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormState((prev) => prev ? {
      ...prev,
      [field]: value,
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState) {
      await mutation.mutateAsync(formState);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formState) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-property-description', {
        body: {
          property: formState,
        },
      });

      if (error) throw error;

      if (data?.description) {
        handleInputChange('description', data.description);
        toast.success('Descrição gerada com sucesso!');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Erro ao gerar descrição. Tente novamente.');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <ImovelEdit
      initialData={formState}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      onGenerateDescription={handleGenerateDescription}
      isLoading={mutation.isPending}
    />
  );
};

export default EditarImovel;