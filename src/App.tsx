
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CaseRetagging from "./pages/CaseRetagging";
import InsightArchiving from "./pages/InsightArchiving";
import LogoSlideGenerator from "./pages/LogoSlideGenerator";
import IrisImageScrapper from "./pages/IrisImageScrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/case-retagging" element={<CaseRetagging />} />
          <Route path="/insight-archiving" element={<InsightArchiving />} />
          <Route path="/logo-slide-generator" element={<LogoSlideGenerator />} />
          <Route path="/iris-image-scrapper" element={<IrisImageScrapper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
