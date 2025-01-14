import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";

export function SearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("location", e.target.value);
    } else {
      newParams.delete("location");
    }
    setSearchParams(newParams);
  };

  const handleTypeChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("type", value);
    } else {
      newParams.delete("type");
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("price", value);
    } else {
      newParams.delete("price");
    }
    setSearchParams(newParams);
  };

  return (
    <div className="search-container p-8 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-6">
        Encontre seu imóvel ideal
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Localização"
          className="bg-white"
          value={searchParams.get("location") || ""}
          onChange={handleLocationChange}
        />
        <Select
          value={searchParams.get("type") || ""}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Tipo de imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="cobertura">Cobertura</SelectItem>
            <SelectItem value="terreno">Terreno</SelectItem>
            <SelectItem value="sala">Sala Comercial</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("price") || ""}
          onValueChange={handlePriceChange}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Faixa de preço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer preço</SelectItem>
            <SelectItem value="0-300000">Até R$ 300.000</SelectItem>
            <SelectItem value="300000-500000">R$ 300.000 - R$ 500.000</SelectItem>
            <SelectItem value="500000-800000">R$ 500.000 - R$ 800.000</SelectItem>
            <SelectItem value="800000-1000000">R$ 800.000 - R$ 1.000.000</SelectItem>
            <SelectItem value="1000000-99999999">Acima de R$ 1.000.000</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-white text-primary hover:bg-white/90">
          Buscar
        </Button>
      </div>
    </div>
  );
}