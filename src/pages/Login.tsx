import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { AuthError, AuthApiError } from '@supabase/supabase-js';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        toast.success("Login realizado com sucesso!");
        const returnTo = location.state?.from || '/';
        navigate(returnTo, { replace: true });
      }
      if (event === 'SIGNED_OUT') {
        setError("");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.code) {
        case 'invalid_credentials':
          return 'Credenciais inválidas. Por favor, verifique seu email e senha.';
        case 'email_not_confirmed':
          return 'Por favor, verifique seu email antes de fazer login.';
        case 'user_not_found':
          return 'Usuário não encontrado com essas credenciais.';
        case 'invalid_grant':
          return 'Credenciais de login inválidas.';
        default:
          return error.message;
      }
    }
    return error.message;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Bem-vindo</h1>
          <p className="text-muted-foreground">Faça login para continuar</p>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="bg-card p-6 rounded-lg shadow-lg border">
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