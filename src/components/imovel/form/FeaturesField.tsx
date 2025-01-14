import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFormData } from "@/types/imovel";

interface FeaturesFieldProps {
  formData: PropertyFormData;
  onFeatureChange: (feature: string, checked: boolean) => void;
}

export const FeaturesField = ({ formData, onFeatureChange }: FeaturesFieldProps) => {
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
    <div>
      <label className="block text-sm font-medium mb-3">Características</label>
      <div className="grid grid-cols-2 gap-4">
        {features.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={(formData.features as Record<string, boolean>)?.[id] || false}
              onCheckedChange={(checked) => onFeatureChange(id, checked as boolean)}
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
  );
};
