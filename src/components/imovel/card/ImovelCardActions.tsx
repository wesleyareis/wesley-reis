import { Button } from "@/components/ui/button";
import { Edit, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ImovelCardActionsProps {
  propertyCode: string;
  isAgent: boolean;
  isLoading?: boolean;
  onEditClick: (e: React.MouseEvent) => void;
}

export function ImovelCardActions({ 
  propertyCode, 
  isAgent, 
  isLoading,
  onEditClick 
}: ImovelCardActionsProps) {
  return (
    <div className="p-4 pt-0 flex justify-between">
      <Link
        to={`/imovel/${propertyCode}`}
        className="text-primary hover:text-primary/80 font-medium text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        Ver detalhes →
      </Link>
      {isAgent && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onEditClick}
          disabled={isLoading}
          className="z-10"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Edit className="w-4 h-4" />
          )}
        </Button>
      )}
    </div>
  );
}