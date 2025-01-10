import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Limpa qualquer token inválido antes de verificar a sessão
        const currentSession = localStorage.getItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        if (currentSession) {
          try {
            JSON.parse(currentSession);
          } catch (e) {
            console.error("Token inválido encontrado, removendo...");
            localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
            return;
          }
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
          return;
        }

        if (session?.user) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
      } finally {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Primeiro, limpa qualquer sessão existente
      await supabase.auth.signOut();
      localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
      
      // Tenta fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        });

        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login Corretor</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;