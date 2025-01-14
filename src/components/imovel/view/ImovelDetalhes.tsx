import { PropertyData } from "@/types/imovel";

interface ImovelDetalhesProps {
  property: PropertyData;
}

export const ImovelDetalhes = ({ property }: ImovelDetalhesProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Detalhes do Imóvel</h2>
        {property.property_code && (
          <span className="text-sm text-muted-foreground">
            Código: {property.property_code}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {property.bedrooms && (
          <div>
            <p className="text-sm text-muted-foreground">Quartos</p>
            <p className="font-medium">{property.bedrooms}</p>
          </div>
        )}

        {property.bathrooms && (
          <div>
            <p className="text-sm text-muted-foreground">Banheiros</p>
            <p className="font-medium">{property.bathrooms}</p>
          </div>
        )}

        {property.parking_spaces && (
          <div>
            <p className="text-sm text-muted-foreground">Vagas</p>
            <p className="font-medium">{property.parking_spaces}</p>
          </div>
        )}

        {property.total_area && (
          <div>
            <p className="text-sm text-muted-foreground">Área Total</p>
            <p className="font-medium">{property.total_area} m²</p>
          </div>
        )}
      </div>
    </div>
  );
};