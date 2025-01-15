import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { AuthError, AuthApiError } from '@supabase/supabase-js';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Verificando sessão existente...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          handleError(error);
          return;
        }

        if (session) {
          console.log("Sessão encontrada, redirecionando...");
          navigate('/', { replace: true });
        } else {
          console.log("Nenhuma sessão encontrada, mostrando tela de login");
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        handleError(error);
      }
    };

    const handleError = (error: any) => {
      console.error('Detalhes do erro de autenticação:', {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error
      });
      
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 400:
            if (error.message.includes('Email not confirmed')) {
              toast.error("Por favor, confirme seu email antes de fazer login");
            } else if (error.message.includes('Invalid login credentials')) {
              toast.error("Email ou senha incorretos. Verifique suas credenciais.");
            } else {
              toast.error(`Erro de autenticação: ${error.message}`);
            }
            break;
          case 422:
            toast.error("Por favor, preencha todos os campos corretamente");
            break;
          case 429:
            toast.error("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
            break;
          default:
            toast.error(`Erro ao tentar fazer login: ${error.message}`);
        }
      } else if (error.message === "Failed to fetch") {
        toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        toast.error(`Erro inesperado: ${error.message}`);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticação:", event, {
        hasSession: !!session,
        timestamp: new Date().toISOString()
      });
      
      if (event === 'SIGNED_IN') {
        console.log("Login bem-sucedido, redirecionando...");
        toast.success("Login realizado com sucesso!");
        navigate('/');
      } else if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      } else if (event === 'USER_UPDATED') {
        try {
          const { error } = await supabase.auth.getSession();
          if (error) handleError(error);
        } catch (error) {
          handleError(error);
        }
      }
    });

    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Bem-vindo</h1>
          <p className="text-muted-foreground">Faça login para continuar</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full',
                input: 'rounded-md',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;