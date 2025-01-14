import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useGoogleMapsKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        console.log('Tentando carregar a chave da API do Google Maps...');
        
        const { data: key, error: supabaseError } = await supabase
          .rpc('get_setting', { setting_key: 'GOOGLE_MAPS_API_KEY' });

        console.log('Resposta do Supabase:', { key });

        if (supabaseError) {
          throw new Error(`Erro Supabase: ${supabaseError.message}`);
        }

        if (!key) {
          throw new Error('Chave da API não encontrada');
        }

        console.log('Chave da API carregada com sucesso');
        setApiKey(key);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        console.error('Erro ao carregar chave da API:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  return { apiKey, error, isLoading };
}