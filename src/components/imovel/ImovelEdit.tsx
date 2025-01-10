import { PropertyForm } from "./PropertyForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/property";

interface PropertyEditProps {
  formData: PropertyFormData;
  isLoading: boolean;
  isGeneratingDescription: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGenerateDescription: () => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const PropertyEdit = ({
  formData,
  isLoading,
  isGeneratingDescription,
  onInputChange,
  onGenerateDescription,
  onSubmit
}: PropertyEditProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            ← Voltar para Dashboard
          </Button>
          <h1 className="text-2xl font-bold">
            {formData.id ? "Editar Imóvel" : "Novo Imóvel"}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <PropertyForm
          formData={formData}
          isLoading={isLoading}
          isGeneratingDescription={isGeneratingDescription}
          onInputChange={onInputChange}
          onGenerateDescription={onGenerateDescription}
          onSubmit={onSubmit}
        />
      </main>
    </div>
  );
};