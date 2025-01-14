import { PropertyData } from "@/types/imovel";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

interface ImovelImagensProps {
  property: PropertyData;
}

export const ImovelImagens = ({ property }: ImovelImagensProps) => {
  if (!property.images || property.images.length === 0) return null;

  return (
    <div className="mb-8">
      <Carousel className="w-full relative group">
        <CarouselContent>
          {property.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video w-full rounded-lg overflow-hidden relative">
                <img
                  src={image}
                  alt={`${property.title} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Carousel>
    </div>
  );
};