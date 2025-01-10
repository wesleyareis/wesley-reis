import { ImovelForm } from "./ImovelForm";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PropertyFormData } from "@/types/imovel";

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