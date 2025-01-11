import { Building2, Bath, Car, Bed } from "lucide-react";

interface ImovelCardFeaturesProps {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
}

export function ImovelCardFeatures({ 
  bedrooms, 
  bathrooms, 
  parkingSpaces, 
  area 
}: ImovelCardFeaturesProps) {
  return (
    <div className="grid grid-cols-4 gap-2 text-sm">
      <div className="flex items-center gap-1">
        <Bed className="w-4 h-4" />
        <span>{bedrooms}</span>
      </div>
      <div className="flex items-center gap-1">
        <Bath className="w-4 h-4" />
        <span>{bathrooms}</span>
      </div>
      <div className="flex items-center gap-1">
        <Car className="w-4 h-4" />
        <span>{parkingSpaces}</span>
      </div>
      <div className="flex items-center gap-1">
        <Building2 className="w-4 h-4" />
        <span>{area}m²</span>
      </div>
    </div>
  );
}