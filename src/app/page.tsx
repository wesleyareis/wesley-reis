import { Suspense } from 'react';
import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SearchFilters } from "@/components/SearchFilters";
import { ImovelCard } from "@/components/ImovelCard";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from 'next/link';
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: 'Wesley Reis Imóveis | Imóveis em Goiânia e região',
  description: 'Encontre seu imóvel ideal em Goiânia e região. Apartamentos, casas e muito mais.',
  openGraph: {
    title: 'Wesley Reis Imóveis | Imóveis em Goiânia e região',
    description: 'Encontre seu imóvel ideal em Goiânia e região. Apartamentos, casas e muito mais.',
    url: 'https://wesleyreis.imb.br',
    siteName: 'Wesley Reis Imóveis',
    locale: 'pt_BR',
    type: 'website',
  },
};

async function getProperties() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return properties || [];
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tight text-primary hover:text-primary/90 transition-colors">
            WesleyReis
          </Link>
          <nav className="flex gap-4 items-center">
            <Button
              variant="outline"
              asChild
              className="flex items-center gap-2"
            >
              <Link href="/login">
                <LogIn className="w-4 h-4" />
                Login Corretor
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <SearchFilters />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Imóveis em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={<div>Carregando imóveis...</div>}>
              {properties.map((property) => (
                <ImovelCard
                  key={property.id}
                  id={property.id}
                  property_code={property.property_code || ''}
                  title={property.title}
                  price={property.price}
                  location={`${property.neighborhood}, ${property.city}`}
                  bedrooms={property.bedrooms || 0}
                  bathrooms={property.bathrooms || 0}
                  parkingSpaces={property.parking_spaces || 0}
                  area={property.total_area || 0}
                  imageUrl={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400"}
                />
              ))}
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}