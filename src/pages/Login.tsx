import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-xl bg-black/20 rounded-lg border border-white/10 p-8 shadow-xl animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <LogIn className="w-8 h-8 text-[#0088cc]" />
          <h1 className="text-2xl font-bold text-center text-white">
            Telegram Manager
          </h1>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#0088cc",
                  brandAccent: "#006699",
                  defaultButtonBackground: "black",
                  defaultButtonBackgroundHover: "#1a1a1a",
                  inputBackground: "rgba(0, 0, 0, 0.1)",
                  inputBorder: "rgba(255, 255, 255, 0.1)",
                  inputBorderHover: "rgba(255, 255, 255, 0.2)",
                  inputBorderFocus: "#0088cc",
                },
              },
            },
            className: {
              container: "text-white",
              label: "text-white/80",
              button: "bg-[#0088cc] hover:bg-[#006699] text-white",
              input: "bg-black/20 border-white/10 text-white placeholder:text-white/50",
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;