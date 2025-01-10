import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyForm } from "@/components/property/PropertyForm";
import type { PropertyFormData } from "@/types/property";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    price: 0,
    description: "",
    property_type: "",
    bedrooms: 0,
    bathrooms: 0,
    parking_spaces: 0,
    total_area: 0,
    city: "",
    neighborhood: "",
    street_address: "",
    images: [],
  });

  const { data: property, error: queryError } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id || id === "new") return null;
      
      console.log("Fetching property with ID:", id);
      
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Erro ao carregar imóvel",
          description: "Não foi possível carregar os dados do imóvel.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!id && id !== "new",
    retry: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "bedrooms" || name === "bathrooms" || 
              name === "parking_spaces" || name === "total_area" 
              ? Number(value) : value
    }));
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-property-description", {
        body: {
          propertyDetails: {
            type: formData.property_type,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            parkingSpaces: formData.parking_spaces,
            area: formData.total_area,
            location: `${formData.neighborhood}, ${formData.city}`,
          },
        },
      });

      if (error) throw error;

      if (data?.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
        toast({
          title: "Descrição gerada com sucesso!",
          description: "A descrição do imóvel foi atualizada.",
        });
      } else {
        throw new Error("Não foi possível gerar a descrição");
      }
    } catch (error) {
      console.error("Erro ao gerar descrição:", error);
      toast({
        title: "Erro ao gerar descrição",
        description: "Não foi possível gerar a descrição do imóvel.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const propertyData = {
        ...formData,
        agent_id: user.id,
        features: formData.features || {},
      };

      let result;
      if (id === "new") {
        result = await supabase
          .from("properties")
          .insert([propertyData])
          .select()
          .single();
      } else {
        result = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", id)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Sucesso!",
        description: id === "new" ? "Imóvel criado com sucesso!" : "Imóvel atualizado com sucesso!",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o imóvel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update formData when property data is loaded
  useState(() => {
    if (property) {
      const propertyData = {
        ...property,
        features: property.features || {},
      };
      setFormData(propertyData as PropertyFormData);
    }
  }, [property]);

  if (queryError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar imóvel</h2>
          <p className="text-gray-600 mb-4">Não foi possível carregar os dados do imóvel.</p>
          <button onClick={() => navigate("/dashboard")}>Voltar para dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            {id === "new" ? "Novo Imóvel" : "Editar Imóvel"}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <PropertyForm
          formData={formData}
          isLoading={isLoading}
          isGeneratingDescription={isGeneratingDescription}
          onInputChange={handleInputChange}
          onGenerateDescription={generateDescription}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default PropertyDetail;