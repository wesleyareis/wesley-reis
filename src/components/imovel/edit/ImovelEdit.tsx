import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Wand2 } from "lucide-react";
import { toast } from 'sonner';
import type { PropertyData } from '@/types/imovel';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { FeaturesField } from './form/FeaturesField';
import { ImageUploadField } from './form/ImageUploadField';

const propertyTypes = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'sala', label: 'Sala Comercial' }
] as const;

type PropertyType = typeof propertyTypes[number]['value'];

const ImovelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  useAuthCheck(true);

  const { data: imovel, isLoading: isLoadingImovel } = useQuery<PropertyData>({
    queryKey: ['imovel', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('property_code', id)
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error);
        toast.error('Erro ao carregar dados do imóvel');
        return null;
      }
    },
    enabled: !!id,
  });

  const {
    formData,
    isLoading: isLoadingForm,
    isGeneratingDescription,
    handleInputChange,
    generateDescription,
    handleSubmit,
  } = usePropertyForm(imovel || {
    title: "",
    price: 0,
    description: "",
    property_type: "apartamento" as PropertyType,
    bedrooms: 0,
    bathrooms: 0,
    parking_spaces: 0,
    total_area: 0,
    city: "",
    neighborhood: "",
    street_address: "",
    features: {},
    condominium_fee: 0,
    property_tax: 0,
  });

  if (id && isLoadingImovel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>

        <div className="space-y-8">
          <h1 className="text-3xl font-bold">
            {id ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Preço</label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Taxa de Condomínio</label>
                  <Input
                    type="number"
                    name="condominium_fee"
                    value={formData.condominium_fee}
                    onChange={handleInputChange}
                    placeholder="Valor mensal do condomínio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">IPTU</label>
                  <Input
                    type="number"
                    name="property_tax"
                    value={formData.property_tax}
                    onChange={handleInputChange}
                    placeholder="Valor mensal do IPTU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo do Imóvel</label>
                  <Select
                    name="property_type"
                    value={formData.property_type}
                    onValueChange={(value: PropertyType) => {
                      handleInputChange({
                        target: { name: 'property_type', value }
                      } as any)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quartos</label>
                    <Input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Banheiros</label>
                    <Input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Vagas</label>
                    <Input
                      type="number"
                      name="parking_spaces"
                      value={formData.parking_spaces}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Área Total (m²)</label>
                    <Input
                      type="number"
                      name="total_area"
                      value={formData.total_area}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <ImageUploadField 
                  images={formData.images || []}
                  onChange={(newImages) => {
                    handleInputChange({
                      target: {
                        name: 'images',
                        value: newImages
                      }
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cidade</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bairro</label>
                  <Input
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Endereço</label>
                  <Input
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium">Descrição</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateDescription}
                      disabled={isGeneratingDescription}
                      className="flex items-center gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      {isGeneratingDescription ? 'Gerando...' : 'Gerar Descrição'}
                    </Button>
                  </div>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <FeaturesField 
                  features={formData.features as Record<string, boolean> || {}}
                  onChange={(feature, checked) => {
                    const newFeatures = {
                      ...(formData.features as Record<string, boolean> || {}),
                      [feature]: checked
                    };
                    handleInputChange({
                      target: {
                        name: 'features',
                        value: newFeatures
                      }
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoadingForm}
              >
                {isLoadingForm ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImovelEdit;