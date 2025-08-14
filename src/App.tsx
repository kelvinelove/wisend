import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Footer from "./components/ui/Footer";

const queryClient = new QueryClient();

// Layout component for pages that should show the footer
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
    <Footer />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Main app/dashboard pages with footer */}
            <Route element={<Layout><Index /></Layout>} path="/" />
            <Route element={<Layout><Profile /></Layout>} path="/profile" />
            <Route element={<Layout><Settings /></Layout>} path="/settings" />
            {/* Auth and 404 pages without footer */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
