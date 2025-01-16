import { useEffect, useRef } from 'react';

interface GoogleMapComponentProps {
  center?: { lat: number; lng: number };
  markers?: { lat: number; lng: number }[];
  className?: string;
  zoom?: number;
}

export function GoogleMapComponent({ 
  center, 
  markers = [], 
  className = '',
  zoom = 16
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  useEffect(() => {
    // Inicializa o mapa
    if (!mapRef.current || mapInstanceRef.current) return;

    const defaultCenter = { lat: -16.6869, lng: -49.2648 };
    
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom,
      center: center || defaultCenter,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });
  }, []);

  useEffect(() => {
    // Atualiza o centro do mapa
    if (!mapInstanceRef.current || !center) return;
    mapInstanceRef.current.setCenter(center);
  }, [center]);

  useEffect(() => {
    // Gerencia os marcadores
    if (!mapInstanceRef.current) return;

    // Limpa marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Adiciona novos marcadores
    markers.forEach(position => {
      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
      });
      markersRef.current.push(marker);
    });
  }, [markers]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
} 