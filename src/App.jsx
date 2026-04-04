import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vault from './pages/Vault';
import Banking from './pages/Banking';
import AIReports from './pages/AIReports';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import Affiliates from './pages/Affiliates';
import TaxReports from './pages/TaxReports';
import Integrations from './pages/Integrations';
import AdminPanel from './pages/AdminPanel';
import Forbidden from './pages/Forbidden';
import AdminRoute from './components/AdminRoute';
import SmartReports from './pages/SmartReports';
import WhatsAppConnect from './pages/WhatsAppConnect';
import AmbassadorProgram from './pages/AmbassadorProgram';
import TaxAuthorityHub from './pages/TaxAuthorityHub';
import AmbassadorDashboard from './pages/AmbassadorDashboard';
import BusinessCustomerTOS from './pages/BusinessCustomerTOS';
import AmbassadorEliteContract from './pages/AmbassadorEliteContract';
import Pricing from './pages/Pricing';
import AICreditStore from './pages/AICreditStore';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0A0A0C" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: "rgba(0,229,255,0.2)", borderTopColor: "#00E5FF" }}></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/reports" element={<AIReports />} />
        <Route path="/tax-reports" element={<TaxReports />} />
  
        <Route path="/integrations" element={<AdminRoute><Integrations /></AdminRoute>} />
        <Route path="/affiliates" element={<AdminRoute><Affiliates /></AdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="/smart-reports" element={<SmartReports />} />
        <Route path="/whatsapp" element={<WhatsAppConnect />} />
        <Route path="/tax-authority" element={<TaxAuthorityHub />} />
        <Route path="/settings" element={<AdminRoute><Settings /></AdminRoute>} />
      </Route>
      <Route path="/ambassador-program" element={<AmbassadorProgram />} />
      <Route path="/ambassador-dashboard" element={<AmbassadorDashboard />} />
      <Route path="/tos-business" element={<BusinessCustomerTOS />} />
      <Route path="/tos-ambassador" element={<AmbassadorEliteContract />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/ai-credits" element={<AICreditStore />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App