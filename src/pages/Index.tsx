import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";

const mockProperties = [
  {
    id: "1",
    title: "Apartamento Luxuoso",
    price: 850000,
    location: "Setor Bueno, Goiânia",
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    area: 120,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400",
  },
  {
    id: "2",
    title: "Casa Moderna",
    price: 1200000,
    location: "Setor Marista, Goiânia",
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 3,
    area: 200,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400",
  },
  {
    id: "3",
    title: "Cobertura Duplex",
    price: 1500000,
    location: "Setor Oeste, Goiânia",
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 3,
    area: 250,
    imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">ImóveisWeb</h1>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium text-gray-700 hover:text-primary">
              Início
            </a>
            <a href="/login" className="text-sm font-medium text-gray-700 hover:text-primary">
              Login Corretor
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters />
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Imóveis em Destaque</h2>
          <div className="property-grid">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
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