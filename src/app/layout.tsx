import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wesley Reis Imóveis',
  description: 'Encontre seu imóvel ideal em Goiânia e região',
  metadataBase: new URL('https://wesleyreis.imb.br'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <HelmetProvider>
          <QueryClientProvider client={new QueryClient({
            defaultOptions: {
              queries: {
                retry: 1,
                refetchOnWindowFocus: false,
              },
            },
          })}>
            <TooltipProvider>
              {children}
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </body>
    </html>
  );
}