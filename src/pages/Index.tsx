import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active");

      if (filters.location) {
        query = query.or(`city.ilike.%${filters.location}%,neighborhood.ilike.%${filters.location}%`);
      }

      if (filters.propertyType) {
        query = query.eq("property_type", filters.propertyType);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (max) {
          query = query.lte("price", max);
        }
        query = query.gte("price", min || 0);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
      
      return data;
    },
  });

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">ImóveisWeb</Link>
          <nav className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={handleLoginClick}
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login Corretor
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters onFilterChange={setFilters} />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Imóveis em Destaque</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
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
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            © 2024 ImóveisWeb. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;