
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import Index from './pages/Index';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import EHR from './pages/EHR';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthProvider';
import { DashboardProvider } from './contexts/DashboardContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdvancedAnalytics } from '@/pages/AdvancedAnalytics';
import { ComplianceSecurityPage } from '@/pages/ComplianceSecurityPage';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <AnalyticsProvider>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                <Route path="/compliance" element={<ComplianceSecurityPage />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/ehr" element={<EHR />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </QueryClientProvider>
          </AnalyticsProvider>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
