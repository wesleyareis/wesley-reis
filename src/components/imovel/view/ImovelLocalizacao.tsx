import { GoogleMapComponent } from "@/components/Maps/GoogleMapComponent";

interface ImovelLocalizacaoProps {
  street_address?: string;
  neighborhood: string;
  city: string;
}

const ImovelLocalizacao = ({ street_address, neighborhood, city }: ImovelLocalizacaoProps) => {
  const address = `${street_address ? street_address + ', ' : ''}${neighborhood}, ${city}`;
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Localização</h2>
      <div className="rounded-lg overflow-hidden h-[400px]">
        <GoogleMapComponent
          center={{ lat: -16.6869, lng: -49.2648 }}
          markers={[{ lat: -16.6869, lng: -49.2648 }]}
          className="w-full h-full"
        />
      </div>
      <p className="mt-4 text-gray-600">{address}</p>
    </div>
  );
};

export default ImovelLocalizacao;