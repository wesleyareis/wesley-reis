import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactFormProps {
  propertyId: string;
  agentId: string;
}

export const ContactForm = ({ propertyId, agentId }: ContactFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "Olá, gostaria de mais informações.",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("leads").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          property_id: propertyId,
          agent_id: agentId,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "O corretor entrará em contato em breve.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "Olá, gostaria de mais informações.",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao tentar enviar sua mensagem.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Mensagem</label>
        <Textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          required
          placeholder="Digite seu email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome <span className="text-red-500">*</span>
          </label>
          <Input
            required
            placeholder="Seu Primeiro Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            WhatsApp <span className="text-red-500">*</span>
          </label>
          <Input
            required
            placeholder="(DD) + Número"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <input type="checkbox" required className="rounded" />
        <span>
          Ao enviar, você afirma que leu, compreendeu e concordou com os nossos{" "}
          <a href="#" className="text-blue-500">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-blue-500">
            Política de Privacidade
          </a>
          .
        </span>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "ENVIAR MENSAGEM"}
      </Button>

      <div className="text-center text-sm text-muted-foreground">ou</div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => window.open("https://wa.me/5562999999999", "_blank")}
      >
        Agendar visita
      </Button>
    </form>
  );
};