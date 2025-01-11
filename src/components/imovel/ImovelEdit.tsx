import { ImovelForm } from "./ImovelForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/imovel";
import { Loader2 } from "lucide-react";

interface ImovelEditProps {
  formData: PropertyFormData;
  isLoading: boolean;
  isGeneratingDescription: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onGenerateDescription: () => Promise<void>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const ImovelEdit = ({
  formData,
  isLoading,
  isGeneratingDescription,
  onInputChange,
  onGenerateDescription,
  onSubmit
}: ImovelEditProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados do imóvel...</p>
        </div>
      </div>
    );
  }

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
            {formData.property_code ? "Editar Imóvel" : "Novo Imóvel"}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ImovelForm
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