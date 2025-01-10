import { Input } from "@/components/ui/input";
import { PropertyFormData } from "@/types/property";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationFieldsProps {
  formData: PropertyFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const LocationFields = ({ formData, onInputChange }: LocationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cidade</label>
        <Input
          name="city"
          value={formData.city}
          onChange={onInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bairro</label>
        <Input
          name="neighborhood"
          value={formData.neighborhood}
          onChange={onInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Endereço</label>
        <Input
          name="street_address"
          value={formData.street_address || ""}
          onChange={onInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL do Google Maps</label>
        <Input
          name="map_url"
          value={formData.map_url || ""}
          onChange={onInputChange}
          placeholder="Cole aqui o link de incorporação do Google Maps"
        />
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Para obter o link de incorporação: 
            1. Acesse Google Maps
            2. Localize o endereço
            3. Clique em "Compartilhar"
            4. Selecione "Incorporar um mapa"
            5. Copie apenas a URL do src do iframe
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};