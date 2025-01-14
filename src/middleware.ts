import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthMiddleware = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);
};