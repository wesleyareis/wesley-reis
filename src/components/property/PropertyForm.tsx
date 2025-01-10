import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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