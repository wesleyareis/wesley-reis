import { Building2, Bath, Car, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PropertyData } from "@/types/property";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PropertyViewProps {
  property: PropertyData;
  canEdit: boolean;
}

export const PropertyView = ({ property, canEdit }: PropertyViewProps) => {
  const navigate = useNavigate();

  const { data: agent } = useQuery({
    queryKey: ['agent', property.agent_id],
    queryFn: async () => {
      if (!property.agent_id) return null;
      const { data } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', property.agent_id)
        .single();
      return data;
    },
    enabled: !!property.agent_id
  });

  const handleWhatsAppClick = () => {
    if (!agent?.whatsapp_url) return;
    
    const propertyUrl = window.location.href;
    const message = `Olá, gostaria de mais informações deste imóvel à venda que vi em seu site: ${propertyUrl}`;
    const whatsappUrl = `${agent.whatsapp_url}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <p className="text-muted-foreground">
                {property.neighborhood}, {property.city}
              </p>
            </div>
            {canEdit && (
              <Button onClick={() => navigate(`/property/edit/${property.id}`)}>
                Editar Imóvel
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {property.images && property.images.length > 0 && (
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video w-full rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${property.title} - Imagem ${index + 1}`}
                        className={cn(
                          "w-full h-full object-cover",
                          index === property.images!.length - 1 && "opacity-80"
                        )}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">Área</span>
                </div>
                <div>{property.total_area}m²</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Bed className="w-5 h-5" />
                  <span className="font-medium">Quartos</span>
                </div>
                <div>{property.bedrooms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Bath className="w-5 h-5" />
                  <span className="font-medium">Banheiros</span>
                </div>
                <div>{property.bathrooms}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-5 h-5" />
                  <span className="font-medium">Vagas</span>
                </div>
                <div>{property.parking_spaces}</div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.features && Object.keys(property.features).length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(property.features).map(([key, value]) => (
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

            {property.map_url && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Localização</h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    src={property.map_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização do imóvel"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold mb-4">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(property.price || 0)}
              </div>
              {property.condominium_fee && (
                <div className="mb-2">
                  <span className="text-muted-foreground">Condomínio:</span>
                  <span className="ml-2">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(property.condominium_fee)}
                    /mês
                  </span>
                </div>
              )}
              {property.property_tax && (
                <div className="mb-4">
                  <span className="text-muted-foreground">IPTU:</span>
                  <span className="ml-2">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(property.property_tax)}
                    /mês
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
                  <Button className="w-full" onClick={handleWhatsAppClick}>
                    Falar no WhatsApp
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};