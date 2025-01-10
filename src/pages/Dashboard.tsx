import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [agentProfile, setAgentProfile] = useState<any>(null);

  useEffect(() => {
    const fetchAgentProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('agent_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setAgentProfile(profile);
      }
    };
    fetchAgentProfile();
  }, []);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["agent-properties"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", user?.id);

      if (error) throw error;
      return data;
    },
  });

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
          <Button onClick={() => navigate("/property/new")} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Imóvel
          </Button>
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
                  {...property}
                  imageUrl={property.images?.[0] || "https://via.placeholder.com/400"}
                  location={`${property.neighborhood}, ${property.city}`}
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