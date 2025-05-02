
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaseRetagging from "./pages/CaseRetagging";
import InsightArchiving from "./pages/InsightArchiving";
import LogoSlideGenerator from "./pages/LogoSlideGenerator";
import IrisImageScrapper from "./pages/IrisImageScrapper";
import QueueStatus from "./pages/QueueStatus";

// Create the QueryClient outside of the component
const queryClient = new QueryClient();

// Define App component explicitly as a function component
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/case-retagging" element={<CaseRetagging />} />
                  <Route path="/insight-archiving" element={<InsightArchiving />} />
                  <Route path="/logo-slide-generator" element={<LogoSlideGenerator />} />
                  <Route path="/iris-image-scrapper" element={<IrisImageScrapper />} />
                  <Route path="/queue-status" element={<QueueStatus />} />
                </Route>
                
                {/* Redirect to login if not authenticated */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
