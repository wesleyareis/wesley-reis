import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Primeiro, verifica se há uma sessão válida
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError);
          throw sessionError;
        }

        if (!session) {
          throw new Error("Sessão não encontrada");
        }

        // Verifica se o token ainda é válido
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Erro ao verificar usuário:", userError);
          throw userError || new Error("Usuário não encontrado");
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro de autenticação:", error);
        // Limpa a sessão local em caso de erro
        await supabase.auth.signOut();
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        setIsAuthenticated(false);
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false);
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        navigate('/login', { replace: true });
        return;
      }

      if (session) {
        setIsAuthenticated(true);
      }
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};