
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
import RemindIQ from './pages/agents/RemindIQ';
import { EHRDashboard } from './components/ehr/EHRDashboard';
import { WorkflowOrchestration } from './components/manager/WorkflowOrchestration';
import ScheduleIQProduction from './pages/agents/ScheduleIQProduction';
import PilotDemo from "./pages/PilotDemo";
import { BookAppointment } from './pages/BookAppointment';
import { RescheduleAppointment } from './pages/RescheduleAppointment';
import PatientManagement from './pages/PatientManagement';
import EHRIQ from './pages/agents/EHRIQ';
import AIInsights from './pages/AIInsights';

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
            <Route path="/patient-management" element={<Layout><PatientManagement /></Layout>} />
            <Route path="/schedule" element={<Layout><ScheduleIQ /></Layout>} />
            <Route path="/schedule-iq" element={<Layout><ScheduleIQ /></Layout>} />
            <Route path="/schedule-iq-production" element={<Layout><ScheduleIQProduction /></Layout>} />
            <Route path="/intake-iq" element={<Layout><IntakeIQ /></Layout>} />
            <Route path="/agents/intake" element={<Layout><IntakeIQ /></Layout>} />
            <Route path="/agents/remind" element={<Layout><RemindIQ /></Layout>} />
            <Route path="/claims-iq" element={<Layout><ClaimsIQ /></Layout>} />
            <Route path="/scribe-iq" element={<Layout><ScribeIQ /></Layout>} />
            <Route path="/ehr" element={<Layout><EHRIQ /></Layout>} />
            <Route path="/ehr-dashboard" element={<Layout><EHRDashboard /></Layout>} />
            <Route path="/insights" element={<Layout><AIInsights /></Layout>} />
            <Route path="/workflow-orchestration" element={<Layout><WorkflowOrchestration /></Layout>} />
            <Route path="/pilot-demo" element={<PilotDemo />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/reschedule-appointment/:appointmentId" element={<RescheduleAppointment />} />
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
