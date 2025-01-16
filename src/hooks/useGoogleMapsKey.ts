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

        // Pega a sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error('Não autenticado');
        }

        // Busca a chave usando a Edge Function
        const { data, error } = await supabase.functions.invoke('get-maps-key', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) throw error;
        
        if (data?.key) {
          sessionStorage.setItem('google_maps_key', data.key);
          setKey(data.key);
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