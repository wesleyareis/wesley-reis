import { PropertyData } from "@/types/imovel";

interface ImovelPrecoProps {
  property: PropertyData;
}

export const ImovelPreco = ({ property }: ImovelPrecoProps) => {
  return (
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
  );
};