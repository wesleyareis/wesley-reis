import { PropertyData } from "@/types/property";

interface PropertyLocationProps {
  property: PropertyData;
}

export const PropertyLocation = ({ property }: PropertyLocationProps) => {
  if (!property.map_url) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          src={property.map_url}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização do imóvel"
        />
      </div>
    </div>
  );
};