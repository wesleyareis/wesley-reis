import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PropertyAgentProps {
  agent: {
    full_name: string;
    creci?: string | null;
    profile_image?: string | null;
    whatsapp_url?: string | null;
  };
  propertyUrl: string;
  onWhatsAppClick: () => void;
}

export const PropertyAgent = ({ agent, propertyUrl, onWhatsAppClick }: PropertyAgentProps) => {
  const handleWhatsAppClick = () => {
    if (agent.whatsapp_url) {
      const message = encodeURIComponent(`Olá, gostaria de mais informações sobre este imóvel: ${propertyUrl}`);
      window.open(`${agent.whatsapp_url}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={agent.profile_image || undefined} alt={agent.full_name} />
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
  );
};