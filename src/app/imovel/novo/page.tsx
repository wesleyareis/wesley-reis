import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ImovelEdit } from "@/components/imovel/ImovelEdit";

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

  return (
    <div className="min-h-screen bg-background">
      <ImovelEdit />
    </div>
  );
}