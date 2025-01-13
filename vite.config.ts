import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Aceita conexões de qualquer IP
    port: 8080,
    strictPort: true, // Falha se a porta estiver em uso
  },
  preview: {
    host: true, // Aceita conexões de qualquer IP
    port: 8080,
    strictPort: true, // Falha se a porta estiver em uso
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));