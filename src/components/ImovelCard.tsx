import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Bath, Car, Bed, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  area: number;
  imageUrl: string;
  agent_id?: string;
}

export function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  parkingSpaces,
  area,
  imageUrl,
  agent_id,
}: PropertyCardProps) {
  const [isAgent, setIsAgent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfAgent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAgent(!!user && user.id === agent_id);
    };
    checkIfAgent();
  }, [agent_id]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2 bg-primary text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{location}</p>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>{parkingSpaces}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            <span>{area}m²</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link
          to={`/property/${id}`}
          className="text-primary hover:text-primary/80 font-medium text-sm"
        >
          Ver detalhes →
        </Link>
        {isAgent && (
          <div className="flex gap-2">
            <Link to={`/property/edit/${id}`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}