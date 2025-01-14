import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ImovelView } from "@/components/imovel/ImovelView";
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    property_code: string;
  };
  searchParams: {
    mode?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: property } = await supabase
    .from('properties')
    .select('title, description')
    .eq('property_code', params.property_code)
    .single();

  if (!property) {
    return {
      title: 'Imóvel não encontrado | Wesley Reis Imóveis',
      description: 'O imóvel que você procura não foi encontrado.',
    };
  }

  return {
    title: `${property.title} | Wesley Reis Imóveis`,
    description: property.description || 'Confira os detalhes deste imóvel.',
  };
}

export default async function ImovelPage({ params, searchParams }: PageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: property } = await supabase
    .from('properties')
    .select('*, agent_profiles(*)')
    .eq('property_code', params.property_code)
    .single();

  if (!property) {
    notFound();
  }

  const isAgent = user?.id === property.agent_id;
  const isEditMode = searchParams.mode === 'edit' && isAgent;

  const initialFormData = {
    ...property,
    features: property.features || {},
  };

  return (
    <div className="min-h-screen bg-background">
      {isEditMode ? (
        <ImovelEdit 
          formData={initialFormData}
          isLoading={false}
          isGeneratingDescription={false}
          onInputChange={() => {}}
          onGenerateDescription={async () => {}}
          onSubmit={async () => {}}
        />
      ) : (
        <ImovelView 
          property={property}
          canEdit={isAgent}
        />
      )}
    </div>
  );
}