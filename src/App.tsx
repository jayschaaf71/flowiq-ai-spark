
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { PatientAuth } from './pages/PatientAuth';
import ScheduleIQ from './pages/agents/ScheduleIQ';
import IntakeIQ from './pages/agents/IntakeIQ';
import ClaimsIQ from './pages/agents/ClaimsIQ';
import ScribeIQ from './pages/agents/ScribeIQ';
import { EHRDashboard } from './components/ehr/EHRDashboard';
import { WorkflowOrchestration } from './components/manager/WorkflowOrchestration';
import ScheduleIQProduction from './pages/agents/ScheduleIQProduction';
import PilotDemo from "./pages/PilotDemo";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/patient-auth" element={<PatientAuth />} />
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/patient-dashboard" element={<Layout><PatientDashboard /></Layout>} />
            <Route path="/schedule-iq" element={<Layout><ScheduleIQ /></Layout>} />
            <Route path="/schedule-iq-production" element={<Layout><ScheduleIQProduction /></Layout>} />
            <Route path="/intake-iq" element={<Layout><IntakeIQ /></Layout>} />
            <Route path="/claims-iq" element={<Layout><ClaimsIQ /></Layout>} />
            <Route path="/scribe-iq" element={<Layout><ScribeIQ /></Layout>} />
            <Route path="/ehr-dashboard" element={<Layout><EHRDashboard /></Layout>} />
            <Route path="/workflow-orchestration" element={<Layout><WorkflowOrchestration /></Layout>} />
            <Route path="/pilot-demo" element={<PilotDemo />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
