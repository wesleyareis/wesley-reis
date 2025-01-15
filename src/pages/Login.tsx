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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        toast.success("Login realizado com sucesso");
        navigate('/');
      } else if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password');
      }
    });

    // Verificar se já existe uma sessão ativa
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          handleAuthError(error);
        } else if (session) {
          navigate('/');
        }
      } catch (error) {
        if (error instanceof Error) {
          handleAuthError(error as AuthError);
        }
      }
    };

    const handleAuthError = (error: AuthError) => {
      console.error('Erro de autenticação:', error);
      
      if (error instanceof AuthApiError) {
        switch (error.status) {
          case 400:
            if (error.message.includes('Invalid login credentials')) {
              toast.error("Email ou senha inválidos");
            } else {
              toast.error("Erro de autenticação: dados inválidos");
            }
            break;
          case 422:
            toast.error("Email ou senha não fornecidos");
            break;
          default:
            toast.error("Erro ao tentar fazer login");
        }
      } else {
        toast.error("Erro ao verificar autenticação");
      }
    };

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