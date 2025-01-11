import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

export async function authMiddleware(Component: React.ComponentType) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protege rotas do dashboard
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
}