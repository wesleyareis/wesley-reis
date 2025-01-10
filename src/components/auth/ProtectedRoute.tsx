import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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
        const currentSession = localStorage.getItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        if (currentSession) {
          try {
            JSON.parse(currentSession);
          } catch (e) {
            console.error("Token inválido encontrado, removendo...");
            localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
          return;
        }

        if (!session) {
          setIsAuthenticated(false);
          navigate('/login', { replace: true });
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        setIsAuthenticated(false);
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