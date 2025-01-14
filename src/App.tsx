import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleMapsProvider } from "@/components/Maps/GoogleMapsProvider";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import ImovelDetalhe from "@/components/imovel/view/ImovelDetalhe";
import ImovelEdit from "@/components/imovel/edit/ImovelEdit";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/imovel/novo" element={<ImovelEdit />} />
      <Route path="/imovel/:id" element={<ImovelDetalhe />} />
      <Route path="/imovel/editar/:id" element={<ImovelEdit />} />
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutos
      },
    },
  }));

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GoogleMapsProvider>
            <RouterProvider 
              router={router}
              future={{
                v7_startTransition: true
              }}
            />
            <Toaster />
            <Sonner 
              position="bottom-right"
              closeButton
              richColors
              expand
              theme="light"
            />
          </GoogleMapsProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;