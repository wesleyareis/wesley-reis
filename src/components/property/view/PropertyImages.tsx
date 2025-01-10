import { PropertyData } from "@/types/property";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PropertyImagesProps {
  property: PropertyData;
}

export const PropertyImages = ({ property }: PropertyImagesProps) => {
  if (!property.images || property.images.length === 0) return null;

  return (
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
  );
};