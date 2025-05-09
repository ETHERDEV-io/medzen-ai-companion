
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import MainLayout from "@/components/layout/main-layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import HealthGoals from "./pages/HealthGoals";
import SymptomChecker from "./pages/SymptomChecker";
import AIAssistant from "./pages/AIAssistant";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Legal from "./pages/Legal";
import HowToUse from "./pages/HowToUse";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            <Route path="/medications" element={<MainLayout><Medications /></MainLayout>} />
            <Route path="/health-goals" element={<MainLayout><HealthGoals /></MainLayout>} />
            <Route path="/how-to-use" element={<MainLayout><HowToUse /></MainLayout>} />
            <Route path="/symptom-checker" element={<MainLayout><SymptomChecker /></MainLayout>} />
            <Route path="/ai-assistant" element={<MainLayout><AIAssistant /></MainLayout>} />
            <Route path="/privacy" element={<MainLayout><Privacy /></MainLayout>} />
            <Route path="/terms" element={<MainLayout><Terms /></MainLayout>} />
            <Route path="/legal" element={<MainLayout><Legal /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
