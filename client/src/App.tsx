import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Launcher from "@/pages/launcher";
import SearchPage from "@/pages/search";
import AssetsRepository from "@/pages/assets-repository";
import SmartSearchInProgress from "@/pages/smart-search-in-progress";
import { PreviewProvider } from "@/lib/preview-store";
import FilePreviewDrawer from "@/components/file-preview-drawer";
import { useEffect } from "react";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (location === "/") {
      setLocation("/research/dashboard");
    }
  }, [location, setLocation]);

  return (
    <Layout>
      <Switch>
        <Route path="/research/dashboard" component={Dashboard} />
        <Route path="/smart-search/new" component={Launcher} />
        <Route path="/research/launcher" component={Launcher} />
        <Route path="/research/search" component={SearchPage} />
        <Route path="/smart-search/in-progress/:id" component={SmartSearchInProgress} />
        <Route path="/assets" component={AssetsRepository} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PreviewProvider>
          <Toaster />
          <Router />
          <FilePreviewDrawer />
        </PreviewProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
