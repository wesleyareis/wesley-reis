import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Index = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active");
      
      if (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
      
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tight text-primary hover:text-primary/90 transition-colors">
            WesleyReis
          </Link>
          <nav className="flex gap-4 items-center">
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login Corretor
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Imóveis em Destaque</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <div key={property.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold">{property.title}</h3>
                  <p className="text-gray-600">{property.neighborhood}, {property.city}</p>
                  <p className="text-primary font-bold mt-2">
                    R$ {property.price.toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;