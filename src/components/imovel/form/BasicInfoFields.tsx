import { Input } from "@/components/ui/input";
import { PropertyFormData } from "@/types/property";

interface BasicInfoFieldsProps {
  formData: PropertyFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicInfoFields = ({ formData, onInputChange }: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <Input
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Preço</label>
        <Input
          type="number"
          name="price"
          value={formData.price}
          onChange={onInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Condomínio (mensal)</label>
        <Input
          type="number"
          name="condominium_fee"
          value={formData.condominium_fee || ''}
          onChange={onInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">IPTU (mensal)</label>
        <Input
          type="number"
          name="property_tax"
          value={formData.property_tax || ''}
          onChange={onInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo do Imóvel</label>
        <Input
          name="property_type"
          value={formData.property_type}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Quartos</label>
          <Input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={onInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Banheiros</label>
          <Input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={onInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vagas</label>
          <Input
            type="number"
            name="parking_spaces"
            value={formData.parking_spaces}
            onChange={onInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Área Total (m²)</label>
          <Input
            type="number"
            name="total_area"
            value={formData.total_area}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
};