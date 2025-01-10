import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/property";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { LocationFields } from "./form/LocationFields";
import { DescriptionField } from "./form/DescriptionField";
import { FeaturesField } from "./form/FeaturesField";

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
    const features = formData.features as Record<string, boolean> || {};
    const newFeatures = {
      ...features,
      [feature]: checked
    };
    
    onInputChange({
      target: {
        name: 'features',
        value: newFeatures,
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BasicInfoFields formData={formData} onInputChange={onInputChange} />
        <div className="space-y-4">
          <LocationFields formData={formData} onInputChange={onInputChange} />
          <DescriptionField
            formData={formData}
            isGeneratingDescription={isGeneratingDescription}
            onInputChange={onInputChange}
            onGenerateDescription={onGenerateDescription}
          />
          <FeaturesField
            formData={formData}
            onFeatureChange={handleFeatureChange}
          />
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