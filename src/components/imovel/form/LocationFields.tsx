import { Input } from "@/components/ui/input";
import { PropertyFormData } from "@/types/imovel";

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
    </div>
  );
};
