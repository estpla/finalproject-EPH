
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import BackofficeLayout from "@/components/BackofficeLayout";

import Index from "./pages/Index";
import Athletes from "./pages/Athletes";
import Routines from "./pages/Routines";
import Dashboard from "./pages/Dashboard";
import Sala from "./pages/Sala";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            
            {/* Rutas protegidas - Backoffice */}
            <Route element={<ProtectedRoute />}>
              <Route element={<BackofficeLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/atletas" element={<Athletes />} />
                <Route path="/rutinas" element={<Routines />} />
                <Route path="/sala" element={<Sala />} />
              </Route>
            </Route>
            
            {/* Ruta no encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
