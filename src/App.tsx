import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Media from "./pages/Media";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Webhooks from "./pages/Webhooks";
import { Toaster } from "./components/ui/toaster";
import { SidebarProvider } from "./components/ui/sidebar";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });
  }, [navigate]);

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SidebarProvider>
          <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Navigation />
                      <main className="flex-1 p-4 md:p-8">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/messages" element={<Messages />} />
                          <Route path="/media" element={<Media />} />
                          <Route path="/webhooks" element={<Webhooks />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </SidebarProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;