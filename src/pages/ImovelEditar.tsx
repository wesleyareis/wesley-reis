import { useParams, useNavigate } from 'react-router-dom';
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/imovel';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from "sonner";
import { useState } from 'react';

const EditarImovel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState<PropertyFormData | null>(null);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const mutation = useMutation({
    mutationFn: async (formData: PropertyFormData) => {
      const { error } = await supabase
        .from('properties')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      toast.success('Imóvel atualizado com sucesso!');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Erro ao atualizar imóvel:', error);
      toast.error('Erro ao atualizar imóvel. Tente novamente.');
    },
  });

  const handleGenerateDescription = async () => {
    try {
      const response = await fetch(`/api/generate-property-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      
      if (!response.ok) throw new Error('Falha ao gerar descrição');
      
      const data = await response.json();
      return data.description;
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
      toast.error('Erro ao gerar descrição. Tente novamente.');
      return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState) {
      await mutation.mutateAsync(formState);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!property) {
    return <div>Imóvel não encontrado</div>;
  }

  const formData: PropertyFormData = formState || {
    title: property.title,
    description: property.description,
    price: property.price,
    property_type: property.property_type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parking_spaces: property.parking_spaces,
    total_area: property.total_area,
    city: property.city,
    neighborhood: property.neighborhood,
    street_address: property.street_address,
    building_name: property.building_name,
    features: property.features || {},
    condominium_fee: property.condominium_fee,
    property_tax: property.property_tax,
    images: property.images || [],
  };

  return (
    <div className="min-h-screen bg-background">
      <ImovelEdit 
        formData={formData}
        isLoading={mutation.isPending}
        isGeneratingDescription={false}
        onInputChange={handleInputChange}
        onGenerateDescription={handleGenerateDescription}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditarImovel;