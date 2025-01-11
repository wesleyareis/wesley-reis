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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError);
          await handleLogout();
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Erro ao verificar usuário:", userError);
          await handleLogout();
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro de autenticação:", error);
        await handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    const handleLogout = async () => {
      try {
        // Limpa todos os dados locais
        for (const key of Object.keys(localStorage)) {
          localStorage.removeItem(key);
        }
        for (const key of Object.keys(sessionStorage)) {
          sessionStorage.removeItem(key);
        }

        // Tenta fazer o signOut no Supabase
        await supabase.auth.signOut();
        
        setIsAuthenticated(false);
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        
        // Força um reload completo da página
        window.location.href = '/login';
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        // Mesmo com erro, força o redirecionamento
        window.location.href = '/login';
      }
    };

    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        await handleLogout();
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