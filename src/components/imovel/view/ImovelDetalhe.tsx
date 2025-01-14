import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Building2, Bath, Car, Bed, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImovelLocalizacao } from "./ImovelLocalizacao";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { SlideShow } from "./ImovelSlideshow";

const ImovelDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAgent, setIsAgent] = useState(false);

  // Verifica se o usuário atual é o agente do imóvel
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && id) {
        const { data: property } = await supabase
          .from("properties")
          .select("agent_id")
          .eq("property_code", id)
          .maybeSingle();

        setIsAgent(user.id === property?.agent_id);
      }
    };

    checkAuth();
  }, [id]);

  const { data: imovel, isLoading, error } = useQuery({
    queryKey: ["imovel", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");
      
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("property_code", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Imóvel não encontrado");
      
      return data;
    },
    retry: false
  });

  const { data: agent } = useQuery({
    queryKey: ['agent', imovel?.agent_id],
    queryFn: async () => {
      if (!imovel?.agent_id) return null;
      const { data, error } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', imovel.agent_id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
    enabled: !!imovel?.agent_id
  });

  const handleDelete = async () => {
    try {
      if (!id) throw new Error("ID não fornecido");

      const { error } = await supabase
        .from("properties")
        .update({ status: "inactive" })
        .eq("property_code", id);

      if (error) throw error;

      toast.success("Imóvel excluído com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      toast.error("Erro ao excluir imóvel");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">Imóvel não encontrado</p>
        <Button onClick={() => navigate("/")}>Voltar para Início</Button>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-lg text-muted-foreground">Imóvel não encontrado</p>
        <Button onClick={() => navigate("/")}>Voltar para Início</Button>
      </div>
    );
  }

  // Formata o endereço completo para o mapa, lidando com campos opcionais
  const fullAddress = [
    imovel.street_address,
    imovel.neighborhood,
    imovel.city,
    'Brasil'
  ].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            ← Voltar
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{imovel.title}</h1>
              <p className="text-muted-foreground">
                {imovel.neighborhood}, {imovel.city}
              </p>
            </div>
            {isAgent && (
              <div className="flex gap-2">
                <Button onClick={() => navigate(`/imovel/editar/${imovel.property_code}`)}>
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {imovel.images && imovel.images.length > 0 && (
          <SlideShow images={imovel.images} />
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Área</span>
                </div>
                <div>{imovel.total_area}m²</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5" />
                  <span className="font-medium">Quartos</span>
                </div>
                <div>{imovel.bedrooms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Bath className="w-5 h-5" />
                  <span className="font-medium">Banheiros</span>
                </div>
                <div>{imovel.bathrooms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5" />
                  <span className="font-medium">Vagas</span>
                </div>
                <div>{imovel.parking_spaces}</div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {imovel.description}
              </p>
            </div>

            {imovel.features && Object.keys(imovel.features).length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(imovel.features).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center gap-2">
                        <span>✓</span>
                        <span className="capitalize">{key.replace(/_/g, " ")}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {imovel && imovel.street_address && imovel.neighborhood && imovel.city && (
              <ImovelLocalizacao 
                address={imovel.street_address}
                neighborhood={imovel.neighborhood}
                city={imovel.city}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold mb-4">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(imovel.price || 0)}
              </div>
              
              {imovel.condominium_fee > 0 && (
                <div className="mb-2">
                  <span className="text-muted-foreground">Condomínio:</span>
                  <span className="ml-2">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(imovel.condominium_fee)}/mês
                  </span>
                </div>
              )}
              
              {imovel.property_tax > 0 && (
                <div className="mb-4">
                  <span className="text-muted-foreground">IPTU:</span>
                  <span className="ml-2">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(imovel.property_tax)}/mês
                  </span>
                </div>
              )}
            </div>

            {agent && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={agent.profile_image} alt={agent.full_name} />
                    <AvatarFallback>{agent.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{agent.full_name}</h3>
                    {agent.creci && (
                      <p className="text-sm text-muted-foreground">CRECI: {agent.creci}</p>
                    )}
                  </div>
                </div>
                {agent.whatsapp_url && (
                  <Button className="w-full" asChild>
                    <a 
                      href={`${agent.whatsapp_url}${agent.whatsapp_url.includes('?') ? '&' : '?'}text=${encodeURIComponent(
                        `Olá! Vi o imóvel ${imovel.title} (código: ${imovel.property_code}) e gostaria de mais informações.`
                      )}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Falar no WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImovelDetalhe;