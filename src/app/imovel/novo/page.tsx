import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { PropertyFormData } from "@/types/imovel";

export const metadata: Metadata = {
  title: 'Novo Imóvel | Wesley Reis Imóveis',
  description: 'Cadastre um novo imóvel na plataforma.',
};

export default async function NovoImovelPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const initialFormData: PropertyFormData = {
    title: '',
    price: 0,
    property_type: '',
    city: '',
    neighborhood: '',
    features: {},
  };

  return (
    <div className="min-h-screen bg-background">
      <ImovelEdit 
        formData={initialFormData}
        isLoading={false}
        isGeneratingDescription={false}
        onInputChange={() => {}}
        onGenerateDescription={async () => {}}
        onSubmit={async () => {}}
      />
    </div>
  );
}