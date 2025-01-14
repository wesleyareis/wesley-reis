import { SearchFilters } from "@/components/SearchFilters"
import { ImovelCard } from "@/components/ImovelCard"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"

export default function Home() {
  const [searchParams] = useSearchParams()

  const { data: properties } = useQuery({
    queryKey: ["properties", Object.fromEntries(searchParams)],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")

      const location = searchParams.get("location")
      const propertyType = searchParams.get("type")
      const priceRange = searchParams.get("price")

      if (location) {
        query = query.or(`city.ilike.%${location}%,neighborhood.ilike.%${location}%`)
      }

      if (propertyType) {
        query = query.eq("property_type", propertyType)
      }

      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number)
        if (max) {
          query = query.lte("price", max)
        }
        query = query.gte("price", min || 0)
      }

      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching properties:", error)
        return []
      }
      
      return data
    },
  })

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
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/login">
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
            {properties?.map((property) => (
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
        </div>
      </main>
    </div>
  )
}