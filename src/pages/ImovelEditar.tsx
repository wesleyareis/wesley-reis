import { useParams } from 'react-router-dom';
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyFormData } from '@/types/imovel';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const EditarImovel = () => {
  const { id } = useParams();

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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!property) {
    return <div>Imóvel não encontrado</div>;
  }

  const formData: PropertyFormData = {
    title: property.title,
    price: property.price,
    property_type: property.property_type,
    city: property.city,
    neighborhood: property.neighborhood,
    features: property.features || {},
  };

  return (
    <div className="min-h-screen bg-background">
      <ImovelEdit 
        formData={formData}
        isLoading={false}
        isGeneratingDescription={false}
        onInputChange={() => {}}
        onGenerateDescription={async () => {}}
        onSubmit={async () => {}}
      />
    </div>
  );
};

export default EditarImovel;