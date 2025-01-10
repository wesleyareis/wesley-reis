import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2 } from "lucide-react";
import { PropertyFormData } from "@/types/imovel";

interface DescriptionFieldProps {
  formData: PropertyFormData;
  isGeneratingDescription: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGenerateDescription: () => Promise<void>;
}

export const DescriptionField = ({
  formData,
  isGeneratingDescription,
  onInputChange,
  onGenerateDescription
}: DescriptionFieldProps) => {
  return (
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
  );
};
