import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language-context";

const NotFound = lazy(() => import("@/pages/not-found"));
const GatewayPage = lazy(() => import("@/pages/GatewayPage"));
const DonorDashboard = lazy(() => import("@/pages/DonorDashboard"));
const HospitalDashboard = lazy(() => import("@/pages/HospitalDashboard"));
const LabDashboard = lazy(() => import("@/pages/LabDashboard"));
const AuthorityDashboard = lazy(() => import("@/pages/AuthorityDashboard"));
const FounderDashboard = lazy(() => import("@/pages/FounderDashboard"));
const SOSPage = lazy(() => import("@/pages/SOSPage"));
const AdvancedModulesPage = lazy(() => import("@/pages/AdvancedModulesPage"));
const AllModulesPage = lazy(() => import("@/pages/AllModulesPage"));

const queryClient = new QueryClient();

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050b18]" aria-label="Loading" />}>
      <Switch>
        <Route path="/" component={GatewayPage} />
        <Route path="/donor" component={DonorDashboard} />
        <Route path="/hospital" component={HospitalDashboard} />
        <Route path="/lab" component={LabDashboard} />
        <Route path="/authority" component={AuthorityDashboard} />
        <Route path="/founder" component={FounderDashboard} />
        <Route path="/sos" component={SOSPage} />
        <Route path="/modules" component={AdvancedModulesPage} />
        <Route path="/all-modules" component={AllModulesPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
