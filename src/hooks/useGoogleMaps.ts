import { useEffect, useState } from 'react';
import { useGoogleMapsKey } from './useGoogleMapsKey';

interface GoogleMapsState {
  isLoaded: boolean;
  loadError: Error | null;
}

const SCRIPT_ID = 'google-maps-script';
let isScriptLoading = false;

export function useGoogleMaps(): GoogleMapsState {
  const [state, setState] = useState<GoogleMapsState>({
    isLoaded: !!window.google?.maps,
    loadError: null,
  });
  
  const { apiKey, isLoading: isKeyLoading, error: keyError } = useGoogleMapsKey();

  useEffect(() => {
    if (window.google?.maps) {
      setState({ isLoaded: true, loadError: null });
      return;
    }

    if (isKeyLoading || !apiKey || isScriptLoading) return;

    if (keyError) {
      setState({ isLoaded: false, loadError: keyError });
      return;
    }

    // Remove qualquer script existente do Google Maps
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    isScriptLoading = true;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    
    script.onload = () => {
      console.log('Script do Google Maps carregado com sucesso');
      isScriptLoading = false;
      setState({ isLoaded: true, loadError: null });
    };

    script.onerror = (error) => {
      console.error('Erro ao carregar script do Google Maps:', error);
      isScriptLoading = false;
      setState({ 
        isLoaded: false, 
        loadError: new Error('Falha ao carregar Google Maps script') 
      });
    };

    document.head.appendChild(script);

    return () => {
      // Não remove o script no cleanup para evitar problemas de carregamento
    };
  }, [apiKey, isKeyLoading, keyError]);

  return state;
} 