import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/property";

interface PropertyFormProps {
  formData: PropertyFormData;
  isLoading: boolean;
  isGeneratingDescription: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGenerateDescription: () => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const PropertyForm = ({
  formData,
  isLoading,
  isGeneratingDescription,
  onInputChange,
  onGenerateDescription,
  onSubmit
}: PropertyFormProps) => {
  const navigate = useNavigate();

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const features = formData.features || {};
    const newFeatures = {
      ...features,
      [feature]: checked
    };
    
    const event = {
      target: {
        name: 'features',
        value: newFeatures
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  const features = [
    { id: "air_conditioning", label: "Ar Condicionado" },
    { id: "balcony", label: "Varanda" },
    { id: "barbecue_grill", label: "Churrasqueira" },
    { id: "elevator", label: "Elevador" },
    { id: "garage", label: "Garagem" },
    { id: "garden", label: "Jardim" },
    { id: "gym", label: "Academia" },
    { id: "laundry", label: "Lavanderia" },
    { id: "pets_allowed", label: "Aceita Pets" },
    { id: "playground", label: "Playground" },
    { id: "pool", label: "Piscina" },
    { id: "security_24h", label: "Segurança 24h" }
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Descrição</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateDescription}
                disabled={isGeneratingDescription}
              >
                {isGeneratingDescription ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Gerar com IA
              </Button>
            </div>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={onInputChange}
              className="h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Características</label>
            <div className="grid grid-cols-2 gap-4">
              {features.map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={formData.features?.[id] || false}
                    onCheckedChange={(checked) => handleFeatureChange(id, checked as boolean)}
                  />
                  <label
                    htmlFor={id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {formData.id ? "Salvar Alterações" : "Criar Imóvel"}
        </Button>
      </div>
    </form>
  );
};