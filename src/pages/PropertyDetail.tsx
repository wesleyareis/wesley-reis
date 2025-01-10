import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { PropertyForm } from "@/components/property/PropertyForm";
import type { PropertyFormData } from "@/types/property";
import { Building2, Bath, Car, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
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

  // Fetch current user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    checkUser();
  }, []);

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

  // Check if user has permission to edit
  const canEdit = id === "new" || (property && currentUser && property.agent_id === currentUser);
  const isEditMode = window.location.pathname.includes('/edit/');

  // Redirect if trying to edit without permission
  useEffect(() => {
    if (isEditMode && property && !canEdit) {
      navigate(`/property/${id}`);
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para editar este imóvel.",
        variant: "destructive",
      });
    }
  }, [property, canEdit, id, navigate, isEditMode]);

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
  useEffect(() => {
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
          <Button onClick={() => navigate("/")}>Voltar para página inicial</Button>
        </div>
      </div>
    );
  }

  // Show property details for non-edit mode
  if (!isEditMode) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="mb-4"
            >
              ← Voltar
            </Button>
            <h1 className="text-2xl font-bold">{property?.title}</h1>
            <p className="text-muted-foreground">
              {property?.neighborhood}, {property?.city}
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {property?.images && property.images.length > 0 && (
            <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Descrição</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {property?.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span>{property?.bedrooms} Quartos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5" />
                    <span>{property?.bathrooms} Banheiros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    <span>{property?.parking_spaces} Vagas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>{property?.total_area}m²</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <div className="text-3xl font-bold mb-4">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(property?.price || 0)}
              </div>
              <Button className="w-full" size="lg">
                Entrar em contato
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show edit form for edit mode
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
