import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/PropertyCard";
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setAgentProfile(profile);
    };
    
    checkAuth();
  }, [navigate]);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["agent-properties"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const handleNewProperty = () => {
    navigate("/property/new");
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear(); // Limpa todo o localStorage
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta.",
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar.",
        variant: "destructive",
      });
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
                <span className="text-sm font-medium">{agentProfile.full_name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={handleNewProperty} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Imóvel
            </Button>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
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
                <PropertyCard
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