import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { PropertyData } from '@/types/imovel';

export const usePropertyForm = (initialData: Partial<PropertyData>) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<PropertyData>>({
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
    images: [],
    ...initialData
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

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
    setIsGeneratingDescription(true);
    try {
      if (!formData.title || !formData.property_type || !formData.city) {
        throw new Error('Preencha pelo menos o título, tipo do imóvel e cidade');
      }

      const propertyData = {
        title: formData.title,
        type: formData.property_type,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        parking: Number(formData.parking_spaces) || 0,
        area: Number(formData.total_area) || 0,
        city: formData.city,
        neighborhood: formData.neighborhood || '',
        features: Object.entries(formData.features || {})
          .filter(([_, value]) => value === true)
          .map(([key]) => key)
      };

      console.log('Dados sendo enviados:', propertyData);

      const { data, error } = await supabase.functions.invoke('generate-property-description', {
        body: propertyData
      });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      if (data?.description) {
        setFormData(prev => ({
          ...prev,
          description: data.description
        }));
        toast.success('Descrição gerada com sucesso!');
      } else {
        throw new Error('Não foi possível gerar a descrição');
      }
    } catch (error) {
      console.error('Erro ao gerar descrição:', error);
      toast.error(error.message || 'Erro ao gerar descrição');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const propertyData = {
        ...formData,
        agent_id: user.id,
        status: 'active',
        updated_at: new Date().toISOString(),
      };

      if (!formData.id) {
        // Novo imóvel
        propertyData.property_code = crypto.randomUUID().split('-')[0].toUpperCase();
        propertyData.created_at = new Date().toISOString();

        const { error } = await supabase
          .from('properties')
          .insert(propertyData);

        if (error) throw error;
        toast.success('Imóvel criado com sucesso!');
      } else {
        // Atualização de imóvel existente
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', formData.id);

        if (error) throw error;
        toast.success('Imóvel atualizado com sucesso!');
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      toast.error('Erro ao salvar imóvel');
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