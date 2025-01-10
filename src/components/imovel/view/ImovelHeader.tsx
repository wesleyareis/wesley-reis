import { PropertyData } from "@/types/imovel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ImovelHeaderProps {
  property: PropertyData;
  canEdit: boolean;
}

export const ImovelHeader = ({ property, canEdit }: ImovelHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          ← Voltar para Início
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{property.title}</h1>
            {property.property_code && (
              <p className="text-sm text-muted-foreground mt-1">
                Código: {property.property_code}
              </p>
            )}
          </div>
          {canEdit && (
            <Button onClick={() => navigate(`/imovel/editar/${property.id}`)}>
              Editar Imóvel
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};