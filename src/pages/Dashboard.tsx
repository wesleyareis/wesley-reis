import { useQuery } from "@tanstack/react-query";
import { ImovelCard } from "@/components/ImovelCard";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agentProfile, setAgentProfile] = useState<any>(null);

  // Verifica autenticação
  useAuthCheck(true);

  // Busca o perfil do agente
  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: profile, error } = await supabase
          .from('agent_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          return;
        }

        setAgentProfile(profile);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };

    fetchAgentProfile();
  }, []);

  // Busca as propriedades do agente
  const { data: properties, isLoading } = useQuery({
    queryKey: ["agent-properties"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado");
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    retry: false,
    meta: {
      errorMessage: "Não foi possível carregar as propriedades"
    }
  });

  const handleNewProperty = () => {
    navigate("/imovel/novo");
  };

  const handleLogout = async () => {
    try {
      // Primeiro limpa todos os tokens do Supabase
      const supabaseTokenKey = 'sb-' + process.env.SUPABASE_PROJECT_ID + '-auth-token';
      localStorage.removeItem(supabaseTokenKey);
      
      // Limpa qualquer outro dado de autenticação
      for (const key of Object.keys(localStorage)) {
        if (key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      }
      
      // Limpa dados da sessão
      sessionStorage.clear();
      
      // Faz o signOut no Supabase com escopo global
      await supabase.auth.signOut({ scope: 'global' });
      
      // Força um reload completo da página
      window.location.replace('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, força o redirecionamento
      window.location.replace('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
            {agentProfile && (
              <div className="flex items-center gap-2">
                <img
                  src={agentProfile.profile_image || "https://via.placeholder.com/40"}
                  alt={agentProfile.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium hidden sm:inline">{agentProfile.full_name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/imovel/novo")} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Imóvel</span>
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Seus Imóveis</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : properties?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Você ainda não possui imóveis cadastrados.</p>
              <Button onClick={handleNewProperty} className="mt-4">
                Cadastrar primeiro imóvel
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <ImovelCard
                  key={property.id}
                  id={property.id}
                  property_code={property.property_code || ''}
                  title={property.title}
                  price={property.price}
                  location={`${property.neighborhood}, ${property.city}`}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  parkingSpaces={property.parking_spaces}
                  area={property.total_area}
                  imageUrl={property.images?.[0] || "https://via.placeholder.com/400"}
                  agent_id={property.agent_id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;