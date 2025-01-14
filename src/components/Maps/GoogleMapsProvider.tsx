import { createContext, useContext, ReactNode } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { useGoogleMapsKey } from './useGoogleMapsKey';
import { GOOGLE_MAPS_LIBRARIES } from './config';

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | null>(null);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { apiKey, error: keyError, isLoading: keyLoading } = useGoogleMapsKey();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  if (keyError) {
    console.error('Erro ao carregar chave da API:', keyError);
  }

  return (
    <GoogleMapsContext.Provider value={{ 
      isLoaded: isLoaded && !keyLoading, 
      loadError: loadError || (keyError ? new Error(keyError) : undefined) 
    }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps deve ser usado dentro de GoogleMapsProvider');
  }
  return context;
}