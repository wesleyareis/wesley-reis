import { Building2, Bath, Car, Bed } from "lucide-react";
import { PropertyData } from "@/types/imovel";

interface ImovelDetalhesProps {
  property: PropertyData;
}

export const ImovelDetalhes = ({ property }: ImovelDetalhesProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5" />
          <span className="font-medium">Área</span>
        </div>
        <div>{property.total_area}m²</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Bed className="w-5 h-5" />
          <span className="font-medium">Quartos</span>
        </div>
        <div>{property.bedrooms}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Bath className="w-5 h-5" />
          <span className="font-medium">Banheiros</span>
        </div>
        <div>{property.bathrooms}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-5 h-5" />
          <span className="font-medium">Vagas</span>
        </div>
        <div>{property.parking_spaces}</div>
      </div>
    </div>
  );
};