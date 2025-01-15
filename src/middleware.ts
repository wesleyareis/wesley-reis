import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthError, AuthApiError } from '@supabase/supabase-js';

export const useAuthMiddleware = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session && location.pathname !== '/login') {
          toast.error("Você precisa estar logado para acessar esta página");
          navigate('/login', { 
            replace: true,
            state: { from: location.pathname }
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        
        if (error instanceof AuthApiError) {
          switch (error.status) {
            case 400:
              toast.error("Credenciais inválidas");
              break;
            case 401:
              toast.error("Não autorizado");
              break;
            case 422:
              toast.error("Dados inválidos");
              break;
            default:
              toast.error("Erro ao fazer login");
          }
        } else {
          toast.error("Erro ao verificar autenticação");
        }
        
        navigate('/login', { replace: true });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && location.pathname !== '/login') {
        toast.success("Logout realizado com sucesso");
        navigate('/login', { replace: true });
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate, location]);
};