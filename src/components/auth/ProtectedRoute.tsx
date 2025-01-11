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
        // Limpa token do Supabase
        const supabaseTokenKey = 'sb-' + process.env.SUPABASE_PROJECT_ID + '-auth-token';
        localStorage.removeItem(supabaseTokenKey);
        
        // Limpa outros dados de autenticação
        for (const key of Object.keys(localStorage)) {
          if (key.includes('supabase') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        }
        
        // Limpa dados da sessão
        sessionStorage.clear();
        
        // Faz o signOut no Supabase
        await supabase.auth.signOut({ scope: 'global' });
        
        setIsAuthenticated(false);
        toast.error("Sua sessão expirou. Por favor, faça login novamente.");
        
        // Força um reload completo da página
        window.location.replace('/login');
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
        window.location.replace('/login');
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