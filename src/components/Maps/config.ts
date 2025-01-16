export const GOOGLE_MAPS_CONFIG = {
  DEFAULT_CENTER: {
    lat: -16.6869,  // Goiânia como centro padrão
    lng: -49.2648
  },
  DEFAULT_ZOOM: 15,
  LANGUAGE: 'pt-BR',
  REGION: 'BR',
  LIBRARIES: ['places', 'geometry'],
  MAP_OPTIONS: {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }
};