import { Checkbox } from "@/components/ui/checkbox";

interface FeaturesFieldProps {
  features: Record<string, boolean>;
  onChange: (feature: string, checked: boolean) => void;
}

export const FeaturesField = ({ features, onChange }: FeaturesFieldProps) => {
  const featuresList = [
    { id: "academia", label: "Academia" },
    { id: "andar_alto", label: "Andar Alto" },
    { id: "andar_intermediario", label: "Andar Intermediário" },
    { id: "andar_baixo", label: "Andar Baixo" },
    { id: "aquecimento_gas", label: "Aquecimento a Gás" },
    { id: "area_servico", label: "Área de Serviço" },
    { id: "armarios", label: "Armários" },
    { id: "armarios_closet", label: "Armários Closet" },
    { id: "armarios_cozinha", label: "Armários Cozinha" },
    { id: "armarios_embutidos", label: "Armários Embutidos" },
    { id: "armarios_planejados", label: "Armários Planejados" },
    { id: "armarios_quarto", label: "Armários Quarto" },
    { id: "armarios_sala", label: "Armários Sala" },
    { id: "ar_condicionado", label: "Ar Condicionado" },
    { id: "banheiro_servico", label: "Banheiro de Serviço" },
    { id: "banheiro_social", label: "Banheiro Social" },
    { id: "bicicletario", label: "Bicicletário" },
    { id: "brinquedoteca", label: "Brinquedoteca" },
    { id: "churrasqueira", label: "Churrasqueira" },
    { id: "documentacao_ok", label: "Documentação OK" },
    { id: "elevador", label: "Elevador" },
    { id: "energia_solar", label: "Energia Solar" },
    { id: "espaco_gourmet", label: "Espaço Gourmet" },
    { id: "garagem", label: "Garagem" },
    { id: "jardim", label: "Jardim" },
    { id: "lavanderia", label: "Lavanderia" },
    { id: "pets_permitidos", label: "Aceita Pets" },
    { id: "piscina", label: "Piscina" },
    { id: "piscina_privativa", label: "Piscina Privativa" },
    { id: "playground", label: "Playground" },
    { id: "sacada", label: "Sacada" },
    { id: "seguranca_24h", label: "Vigilância 24h" },
    { id: "terraco", label: "Terraço" }
  ];

  return (
    <div>
      <label className="block text-sm font-medium mb-3">Características</label>
      <div className="grid grid-cols-2 gap-4">
        {featuresList.map(({ id, label }) => (
          <div key={id} className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={features?.[id] || false}
              onCheckedChange={(checked) => onChange(id, checked as boolean)}
            />
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}; 