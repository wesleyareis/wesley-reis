import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useGoogleMapsKey() {
  const [key, setKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKey = async () => {
      try {
        // Tenta pegar do sessionStorage primeiro
        const cachedKey = sessionStorage.getItem('google_maps_key');
        if (cachedKey) {
          setKey(cachedKey);
          setIsLoading(false);
          return;
        }

        console.log('Tentando carregar a chave da API do Google Maps...');
        
        const { data: apiKey, error } = await supabase
          .rpc('get_setting', { setting_key: 'GOOGLE_MAPS_API_KEY' });

        console.log('Resposta do Supabase:', { apiKey, error });

        if (error) {
          throw error;
        }

        if (apiKey) {
          sessionStorage.setItem('google_maps_key', apiKey);
          setKey(apiKey);
          console.log('Chave da API carregada com sucesso');
        } else {
          throw new Error('Chave da API não encontrada');
        }
      } catch (error) {
        console.error('Erro ao buscar chave do Google Maps:', error);
        toast.error('Erro ao carregar o mapa. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKey();
  }, []);

  return { key, isLoading };
}