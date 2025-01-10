import { Building2, Bath, Car, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";

interface PropertyViewProps {
  property: PropertyData;
  canEdit: boolean;
}

export const PropertyView = ({ property, canEdit }: PropertyViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <p className="text-muted-foreground">
                {property.neighborhood}, {property.city}
              </p>
            </div>
            {canEdit && (
              <Button onClick={() => navigate(`/property/edit/${property.id}`)}>
                Editar Imóvel
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {property.images && property.images.length > 0 && (
          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5" />
                  <span>{property.bedrooms} Quartos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5" />
                  <span>{property.bathrooms} Banheiros</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  <span>{property.parking_spaces} Vagas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  <span>{property.total_area}m²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <div className="text-3xl font-bold mb-4">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(property.price || 0)}
            </div>
            <Button className="w-full" size="lg">
              Entrar em contato
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};