import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          setIsAuthenticated(false);
          return;
        }
        
        if (!session) {
          console.log("No session found");
          setIsAuthenticated(false);
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User verification failed:", userError);
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        queryClient.clear();
        localStorage.clear();
        window.location.href = '/login';
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session initialization error:", error);
          return;
        }
        
        if (!session) {
          console.log("No active session found during initialization");
          return;
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("User verification failed during initialization:", userError);
          await supabase.auth.signOut();
          queryClient.clear();
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        await supabase.auth.signOut();
        queryClient.clear();
        localStorage.clear();
      }
    };

    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/property/new" 
              element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/property/edit/:id" 
              element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;