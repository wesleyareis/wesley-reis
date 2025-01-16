let isLoading = false;
let isLoaded = false;

export async function loadGoogleMaps(apiKey: string): Promise<void> {
  if (isLoaded) return;
  if (isLoading) {
    // Espera o carregamento atual terminar
    await new Promise(resolve => {
      const checkLoaded = setInterval(() => {
        if (isLoaded) {
          clearInterval(checkLoaded);
          resolve(undefined);
        }
      }, 100);
    });
    return;
  }

  isLoading = true;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Falha ao carregar Google Maps'));
    };

    document.head.appendChild(script);
  });
} 