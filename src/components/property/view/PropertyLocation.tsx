import { PropertyData } from "@/types/property";

interface PropertyLocationProps {
  property: PropertyData;
}

export const PropertyLocation = ({ property }: PropertyLocationProps) => {
  // Verifica se há endereço ou URL do mapa
  if (!property.map_url && !property.street_address) return null;

  // Se não houver URL do mapa mas tiver endereço, cria uma URL do Google Maps
  const mapUrl = property.map_url || `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
    `${property.street_address}, ${property.neighborhood}, ${property.city}`
  )}`;

  // Verifica se a URL é válida
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!isValidUrl(mapUrl)) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">Localização</h2>
        <div className="text-muted-foreground">
          <p>{property.street_address}</p>
          <p>{property.neighborhood}, {property.city}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização do imóvel"
        />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        <p>{property.street_address}</p>
        <p>{property.neighborhood}, {property.city}</p>
      </div>
    </div>
  );
};