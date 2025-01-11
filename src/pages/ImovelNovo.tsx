import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImovelEdit } from "@/components/imovel/ImovelEdit";
import { PropertyFormData } from "@/types/imovel";

export default function ImovelNovo() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const initialFormData: PropertyFormData = {
    title: '',
    price: 0,
    property_type: '',
    city: '',
    neighborhood: '',
    features: {},
  };

  return (
    <div className="min-h-screen bg-background">
      <ImovelEdit 
        formData={initialFormData}
        isLoading={false}
        isGeneratingDescription={false}
        onInputChange={() => {}}
        onGenerateDescription={async () => {}}
        onSubmit={async () => {}}
      />
    </div>
  );
}