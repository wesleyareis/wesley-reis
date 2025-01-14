import { Button } from "@/components/ui/button";
import { Share2, MessageSquare } from "lucide-react";

interface ImovelCorretorProps {
  agent: {
    full_name: string;
    creci?: string;
    phone?: string;
    bio?: string;
    profile_image?: string;
    whatsapp_url?: string;
  };
  propertyUrl: string;
  onWhatsAppClick: () => void;
}

export const ImovelCorretor = ({ agent, propertyUrl, onWhatsAppClick }: ImovelCorretorProps) => {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Compartilhar Imóvel",
        url: propertyUrl
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={agent.profile_image || "https://via.placeholder.com/100"}
          alt={agent.full_name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{agent.full_name}</h3>
          {agent.creci && <p className="text-sm text-muted-foreground">CRECI: {agent.creci}</p>}
        </div>
      </div>

      {agent.bio && <p className="text-sm text-muted-foreground mb-4">{agent.bio}</p>}

      <div className="space-y-2">
        {agent.whatsapp_url && (
          <Button
            className="w-full"
            onClick={onWhatsAppClick}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversar no WhatsApp
          </Button>
        )}
        
        <Button
          variant="outline"
          className="w-full"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};