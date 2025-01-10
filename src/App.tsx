import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import ImovelDetalhe from "./pages/ImovelDetalhe";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro na sessão:", error);
          setIsAuthenticated(false);
          await supabase.auth.signOut();
          navigate('/login', { replace: true });
          return;
        }
        
        if (!session) {
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
          return;
        }

        // Verifica se o token ainda é válido
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Erro ao verificar usuário:", userError);
          setIsAuthenticated(false);
          await supabase.auth.signOut();
          navigate('/login', { replace: true });
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        setIsAuthenticated(false);
        await supabase.auth.signOut();
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Estado de autenticação alterado:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' && !session) {
        setIsAuthenticated(false);
        await supabase.auth.signOut(); // Garante que a sessão seja limpa
        navigate('/login', { replace: true });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/imovel/:id" element={<ImovelDetalhe />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/imovel/novo" 
              element={
                <ProtectedRoute>
                  <ImovelDetalhe />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/imovel/editar/:id" 
              element={
                <ProtectedRoute>
                  <ImovelDetalhe />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;