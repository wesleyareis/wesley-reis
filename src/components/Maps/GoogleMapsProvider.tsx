import { createContext, useContext, ReactNode } from 'react';
import { useGoogleMapsKey } from '@/hooks/useGoogleMapsKey';

interface GoogleMapsContextType {
  apiKey: string | null;
  error: string | null;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({ apiKey: null, error: null });

interface GoogleMapsProviderProps {
  children: ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { key: apiKey, error } = useGoogleMapsKey();

  return (
    <GoogleMapsContext.Provider value={{ apiKey, error }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
}