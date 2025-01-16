import { createContext, ReactNode, useContext } from 'react';
import { useGoogleMapsKey } from '@/hooks/useGoogleMapsKey';

interface GoogleMapsContextType {
  apiKey: string | null;
  isLoading: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({ apiKey: null, isLoading: false });

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { key: apiKey, isLoading } = useGoogleMapsKey();

  return (
    <GoogleMapsContext.Provider value={{ apiKey, isLoading }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMapsContext() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMapsContext must be used within a GoogleMapsProvider');
  }
  return context;
}