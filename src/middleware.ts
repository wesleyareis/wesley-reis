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
          // Limpa a sessão local em caso de erro
          await supabase.auth.signOut();
          return;
        }

        console.log("Status da sessão:", session ? "Autenticado" : "Não autenticado");
        console.log("Localização atual:", location.pathname);

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
      console.error("Detalhes completos do erro:", {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error
      });
      
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 400:
            if (error.message.includes('Invalid login credentials')) {
              toast.error("Email ou senha incorretos. Por favor, verifique suas credenciais.");
            } else if (error.message.includes('Email not confirmed')) {
              toast.error("Por favor, confirme seu email antes de fazer login.");
            } else if (error.message.includes('refresh_token_not_found')) {
              toast.error("Sessão expirada. Por favor, faça login novamente.");
              supabase.auth.signOut();
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
          case 403:
            toast.error("Sessão expirada. Por favor, faça login novamente.");
            supabase.auth.signOut();
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

    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Mudança no estado de autenticação:", event, {
        hasSession: !!session,
        currentPath: location.pathname
      });
      
      if (event === 'SIGNED_IN') {
        console.log("Login bem-sucedido, redirecionando para home");
        toast.success("Login realizado com sucesso!");
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        console.log("Logout detectado, redirecionando para login");
        toast.success("Logout realizado com sucesso!");
        navigate('/login', { replace: true });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token atualizado com sucesso");
      }
    });

    // Verifica a autenticação inicial
    checkAuth();

    // Limpa o listener quando o componente é desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location]);
};