"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SearchFiltersProps {
  onFilterChange: (filters: {
    location: string;
    propertyType: string;
    priceRange: string;
  }) => void;
}

export function SearchFilters() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const handleSearch = () => {
    // Por enquanto apenas loga os filtros, implementaremos a busca depois
    console.log({
      location,
      propertyType,
      priceRange,
    });
  };

  return (
    <div className="search-container p-6 rounded-lg shadow-md bg-white/50 backdrop-blur-sm">
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
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
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
            className="bg-primary text-white hover:bg-primary/90 w-full"
            onClick={handleSearch}
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Imóveis
          </Button>
        </div>
      </div>
    </div>
  );
}