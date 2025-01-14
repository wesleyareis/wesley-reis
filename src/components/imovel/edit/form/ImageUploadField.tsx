import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  images: string[];
  onChange: (newImages: string[]) => void;
}

export const ImageUploadField = ({ images, onChange }: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...images];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      onChange(newImages);
      toast.success('Imagens carregadas com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload das imagens');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Imagens do Imóvel</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group aspect-video">
            <img
              src={image}
              alt={`Imagem ${index + 1} do imóvel`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        <Label 
          htmlFor="images" 
          className="cursor-pointer aspect-video flex items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="text-center">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm text-gray-600">Carregando...</span>
                </>
              ) : (
                <>
                  <ImagePlus className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">Adicionar Imagens</span>
                </>
              )}
            </div>
          </div>
        </Label>
      </div>
    </div>
  );
}; 