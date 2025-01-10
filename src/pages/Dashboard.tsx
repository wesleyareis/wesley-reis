import { useQuery } from "@tanstack/react-query";
import { ImovelCard } from "@/components/ImovelCard";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agentProfile, setAgentProfile] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primeiro, limpa qualquer token inválido
        const currentSession = localStorage.getItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        if (currentSession) {
          try {
            JSON.parse(currentSession);
          } catch (e) {
            console.error("Token inválido encontrado, removendo...");
            localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
            navigate("/login", { replace: true });
            return;
          }
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erro ao verificar sessão:", sessionError);
          localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
          navigate("/login", { replace: true });
          return;
        }

        if (!session) {
          localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
          navigate("/login", { replace: true });
          return;
        }

        // Busca o perfil do agente apenas se houver uma sessão válida
        const { data: profile, error: profileError } = await supabase
          .from('agent_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          return;
        }

        setAgentProfile(profile);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        navigate("/login", { replace: true });
      }
    };

    // Configura o listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
        navigate("/login", { replace: true });
        return;
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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
        .eq("agent_id", session.user.id);

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
      // Primeiro limpa o token local
      localStorage.removeItem('sb-kjlipbbrbwdzqiwvrnpw-auth-token');
      
      // Depois tenta fazer o logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erro ao fazer logout:", error);
        toast({
          title: "Erro ao fazer logout",
          description: "Você foi desconectado, mas ocorreu um erro.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado com sucesso",
          description: "Você foi desconectado com sucesso.",
        });
      }
      
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, força o redirecionamento
      navigate("/login", { replace: true });
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
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-medium hidden sm:inline">{agentProfile.full_name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={handleNewProperty} className="flex items-center gap-2">
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <ImovelCard
                  key={property.id}
                  id={property.id}
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