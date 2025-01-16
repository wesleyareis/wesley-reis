import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          const { data: agentProfile, error: profileError } = await supabase
            .from('agent_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError || !agentProfile) {
            await supabase.auth.signOut();
            throw new Error('Acesso não autorizado. Entre em contato com o administrador.');
          }

          navigate('/');
          toast.success("Login realizado com sucesso");
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Autenticação básica
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Verificar se existe perfil de agente
      const { data: agentProfile, error: profileError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !agentProfile) {
        // Se não tem perfil, faz logout e retorna erro
        await supabase.auth.signOut();
        throw new Error('Acesso não autorizado. Entre em contato com o administrador.');
      }

      // 3. Login bem sucedido
      toast.success("Login realizado com sucesso");
      navigate("/");

    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(
        error.message === "Invalid login credentials"
          ? "Usuário ou senha inválida!"
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Bem-vindo</h1>
          <p className="text-muted-foreground">Faça login para continuar</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
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

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}