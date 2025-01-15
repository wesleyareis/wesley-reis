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
        console.log("Verificando autenticação...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          handleError(error);
          return;
        }

        console.log("Status da sessão:", session ? "Autenticado" : "Não autenticado");

        // Se estiver na página de login e já tiver sessão, redireciona para home
        if (session && location.pathname === '/login') {
          console.log("Usuário já autenticado, redirecionando para home");
          navigate('/', { replace: true });
          return;
        }
        
        // Se não tiver sessão e não estiver na página de login, redireciona para login
        if (!session && location.pathname !== '/login') {
          console.log("Usuário não autenticado, redirecionando para login");
          navigate('/login', { 
            replace: true,
            state: { from: location.pathname }
          });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        handleError(error);
      }
    };

    const handleError = (error: any) => {
      console.error("Detalhes do erro:", error);
      
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 400:
            if (error.message.includes('Invalid login credentials')) {
              toast.error("Email ou senha incorretos. Por favor, verifique suas credenciais.");
            } else {
              toast.error("Erro de autenticação: dados inválidos");
            }
            break;
          case 422:
            toast.error("Email ou senha não fornecidos. Por favor, preencha todos os campos.");
            break;
          case 429:
            toast.error("Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.");
            break;
          case 401:
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            break;
          default:
            toast.error(`Erro ao fazer login: ${error.message}`);
        }
      } else if (error.message === "Failed to fetch") {
        toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        toast.error(`Erro inesperado: ${error.message}`);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Mudança no estado de autenticação:", event);
      
      if (event === 'SIGNED_IN') {
        toast.success("Login realizado com sucesso!");
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT' && location.pathname !== '/login') {
        toast.success("Logout realizado com sucesso!");
        navigate('/login', { replace: true });
      }
    });

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate, location]);
};