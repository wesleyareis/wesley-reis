import { useState, useEffect } from 'react';
import { useGoogleMapsKey } from './useGoogleMapsKey';

const SCRIPT_ID = 'google-maps-script';

interface GoogleMapsState {
  isLoaded: boolean;
  isScriptLoading: boolean;
  loadError: string | null;
}

export function useGoogleMaps() {
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [state, setState] = useState<GoogleMapsState>({
    isLoaded: false,
    isScriptLoading: false,
    loadError: null,
  });
  
  const { key: apiKey, isLoading: isKeyLoading } = useGoogleMapsKey();

  useEffect(() => {
    if (window.google?.maps) {
      setState({ isLoaded: true, isScriptLoading: false, loadError: null });
      return;
    }

    if (isKeyLoading || !apiKey || isScriptLoading) return;

    setIsScriptLoading(true);

    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    
    script.onload = () => {
      console.log('Script do Google Maps carregado com sucesso');
      setState({
        isLoaded: true,
        isScriptLoading: false,
        loadError: null,
      });
      setIsScriptLoading(false);
    };

    script.onerror = () => {
      console.error('Erro ao carregar o script do Google Maps');
      setState({
        isLoaded: false,
        isScriptLoading: false,
        loadError: 'Erro ao carregar o Google Maps',
      });
      setIsScriptLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Não remove o script no cleanup para evitar problemas de carregamento
    };
  }, [apiKey, isKeyLoading]);

  return state;
}