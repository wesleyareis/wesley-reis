import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";

interface PropertyHeaderProps {
  property: PropertyData;
  canEdit: boolean;
}

export const PropertyHeader = ({ property, canEdit }: PropertyHeaderProps) => {
  const navigate = useNavigate();

  return (
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
  );
};