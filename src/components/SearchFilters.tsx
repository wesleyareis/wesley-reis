import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  onFilterChange: (filters: {
    location: string;
    propertyType: string;
    priceRange: string;
  }) => void;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    onFilterChange({
      location,
      propertyType,
      priceRange,
    });
  };

  return (
    <div className="search-container p-6 rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Cidade, bairro ou condomínio"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white"
          />
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Tipo de Imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartamento</SelectItem>
              <SelectItem value="house">Casa</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Faixa de Preço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-500000">Até R$ 500.000</SelectItem>
              <SelectItem value="500000-1000000">R$ 500.000 - R$ 1.000.000</SelectItem>
              <SelectItem value="1000000-2000000">R$ 1.000.000 - R$ 2.000.000</SelectItem>
              <SelectItem value="2000000">Acima de R$ 2.000.000</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleSearch}
          >
            Buscar Imóveis
          </Button>
        </div>
      </div>
    </div>
  );
}