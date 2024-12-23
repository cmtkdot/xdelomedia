import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import Media from "./pages/Media";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Webhooks from "./pages/Webhooks";
import { Toaster } from "./components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <Navigation />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/media" element={<Media />} />
              <Route path="/webhooks" element={<Webhooks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;