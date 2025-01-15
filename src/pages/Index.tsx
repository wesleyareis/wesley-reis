import { useQuery } from "@tanstack/react-query";
import { ImovelCard } from "@/components/ImovelCard";
import { SearchFilters } from "@/components/SearchFilters";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Plus } from "lucide-react";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import type { PropertyData } from "@/types/imovel";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", Object.fromEntries(searchParams)],
    queryFn: async () => {
      try {
        let query = supabase
          .from("properties")
          .select("*")
          .eq("status", "active");

        const location = searchParams.get("location");
        const propertyType = searchParams.get("type");
        const priceRange = searchParams.get("price");

        if (location) {
          const searchTerm = location.toLowerCase();
          query = query.or(`neighborhood.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
        }

        if (propertyType && propertyType !== "todos") {
          query = query.eq("property_type", propertyType);
        }

        if (priceRange && priceRange !== "todos") {
          const [min, max] = priceRange.split("-").map(Number);
          if (!isNaN(min) && !isNaN(max)) {
            query = query.gte("price", min).lte("price", max);
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error("Erro ao buscar propriedades:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Erro ao carregar imóveis"
          });
          return [];
        }

        return data as PropertyData[];
      } catch (error) {
        console.error("Erro inesperado:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar imóveis"
        });
        return [];
      }
    },
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao fazer logout"
      });
    } else {
      toast({
        title: "Sucesso",
        description: "Logout realizado com sucesso"
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tight text-primary hover:text-primary/90 transition-colors">
          {session ? "Dashboard" : (
            <svg viewBox="0 0 800 120" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto"> {/* Mudei de h-8 para h-12 e adicionei w-auto */}
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#833AB4"}}/>
                  <stop offset="50%" style={{stopColor:"#FD1D1D"}}/>
                  <stop offset="100%" style={{stopColor:"#FCB045"}}/>
                </linearGradient>
                <linearGradient id="inner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#833AB4"}}/>
                  <stop offset="50%" style={{stopColor:"#FD1D1D"}}/>
                  <stop offset="100%" style={{stopColor:"#FCB045"}}/>
                </linearGradient>
              </defs>
              <g transform="translate(20, 10)">
                <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#instagram-gradient)"/>
                <circle cx="40" cy="40" r="19" fill="none" stroke="white" strokeWidth="6"/>
                <circle cx="61" cy="19" r="5" fill="white"/>
              </g>
              <text x="120" y="65" fontFamily="Eczar" fontWeight="600" fontSize="42" fill="#1a1a1a">WESLEY</text>
              <text x="305" y="65" fontFamily="Eczar" fontWeight="600" fontSize="54" fill="#1a1a1a">REIS</text>
            </svg>
          )}
        </Link>
          <nav className="flex gap-4 items-center">
            {session ? (
              <>
                <Button
                  onClick={() => navigate('/imovel/novo')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Novo Imóvel
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Área do Corretor
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <SearchFilters />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Listagem em Destaque</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  agent_id={property.agent_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
