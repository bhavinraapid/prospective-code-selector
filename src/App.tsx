import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CodeSelector from "./pages/CodeSelector";
import DataMapping from "./pages/DataMapping";
import NotFound from "./pages/NotFound";
import CodeGroups from "./pages/CodeGroups";
import CommonIndicators from "./pages/CommonIndicators";
import CodeMapping from "./pages/CodeMapping";
import ViewFullMapping from "./pages/ViewFullMapping";
import HealthFrontend from "./pages/HealthFrontend";
import HealthBackend from "./pages/HealthBackend";
import HealthPython from "./pages/HealthPython";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton={true} duration={2000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/code-selector" element={<CodeSelector />} />
          <Route path="/data-mapping/:codeId" element={<DataMapping />} />
          <Route path="/code-groups/:codeId" element={<CodeGroups />} />
          <Route path="/common-indicators" element={<CommonIndicators />} />
          <Route path="/code-mapping" element={<CodeMapping />} />
          <Route path="/view-full-mapping" element={<ViewFullMapping />} />
          <Route path="/health" element={<HealthFrontend />} />
          <Route path="/health-backend" element={<HealthBackend />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/health-python" element={<HealthPython />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
