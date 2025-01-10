import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Bath, Car, Bed, MapPin, Loader2, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState({
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
    images: [] as string[],
  });

  const { data: property } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (id === "new") return null;
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== "new",
  });

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

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
      const response = await fetch(
        "https://kjlipbbrbwdzqiwvrnpw.supabase.co/functions/v1/generate-property-description",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            propertyDetails: {
              type: formData.property_type,
              bedrooms: formData.bedrooms,
              bathrooms: formData.bathrooms,
              parkingSpaces: formData.parking_spaces,
              area: formData.total_area,
              location: `${formData.neighborhood}, ${formData.city}`,
            },
          }),
        }
      );

      const data = await response.json();
      if (data.description) {
        setFormData(prev => ({ ...prev, description: data.description }));
        toast({
          title: "Descrição gerada com sucesso!",
          description: "A descrição do imóvel foi atualizada.",
        });
      }
    } catch (error) {
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
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o imóvel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:text-primary/80"
          >
            ← Voltar para dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Preço</label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo do Imóvel</label>
                <Input
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
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
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Banheiros</label>
                  <Input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Área Total (m²)</label>
                  <Input
                    type="number"
                    name="total_area"
                    value={formData.total_area}
                    onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bairro</label>
                <Input
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <Input
                  name="street_address"
                  value={formData.street_address || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium">Descrição</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateDescription}
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
                  onChange={handleInputChange}
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
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {id === "new" ? "Criar Imóvel" : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PropertyDetail;