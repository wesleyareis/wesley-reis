import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Building2, Bath, Car, Bed, MapPin } from "lucide-react";

const mockProperty = {
  id: "1",
  title: "Apartamento Luxuoso",
  price: 850000,
  location: "Setor Bueno, Goiânia",
  bedrooms: 3,
  bathrooms: 2,
  parkingSpaces: 2,
  area: 120,
  description: "Luxuoso apartamento com acabamento de alto padrão, localizado em área nobre. Possui ampla sala de estar, varanda gourmet, cozinha planejada e área de serviço.",
  imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200",
};

const PropertyDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <a href="/" className="text-primary hover:text-primary/80">← Voltar para listagem</a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <img
              src={mockProperty.imageUrl}
              alt={mockProperty.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            <Badge className="absolute top-4 right-4 text-lg bg-primary text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mockProperty.price)}
            </Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{mockProperty.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-5 h-5" />
              <span>{mockProperty.location}</span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                <Bed className="w-6 h-6" />
                <span className="font-medium">{mockProperty.bedrooms}</span>
                <span className="text-sm text-muted-foreground">Quartos</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                <Bath className="w-6 h-6" />
                <span className="font-medium">{mockProperty.bathrooms}</span>
                <span className="text-sm text-muted-foreground">Banheiros</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                <Car className="w-6 h-6" />
                <span className="font-medium">{mockProperty.parkingSpaces}</span>
                <span className="text-sm text-muted-foreground">Vagas</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg">
                <Building2 className="w-6 h-6" />
                <span className="font-medium">{mockProperty.area}</span>
                <span className="text-sm text-muted-foreground">m²</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold mb-4">Descrição</h2>
              <p className="text-muted-foreground">{mockProperty.description}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;