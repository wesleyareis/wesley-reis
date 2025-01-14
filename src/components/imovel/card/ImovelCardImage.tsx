import { Badge } from "@/components/ui/badge";

interface ImovelCardImageProps {
  imageUrl: string;
  title: string;
  price: number;
}

export function ImovelCardImage({ imageUrl, title, price }: ImovelCardImageProps) {
  return (
    <div className="relative h-48 overflow-hidden">
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
      />
      <Badge className="absolute top-2 right-2 bg-primary text-white">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
      </Badge>
    </div>
  );
}