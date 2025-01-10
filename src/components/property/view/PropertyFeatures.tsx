import { PropertyData } from "@/types/property";

interface PropertyFeaturesProps {
  property: PropertyData;
}

export const PropertyFeatures = ({ property }: PropertyFeaturesProps) => {
  if (!property.features || Object.keys(property.features).length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Características</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(property.features).map(([key, value]) => (
          value && (
            <div key={key} className="flex items-center gap-2">
              <span>✓</span>
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};