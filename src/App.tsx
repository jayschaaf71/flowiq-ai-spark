import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import Index from './pages/Index';
import Manager from './pages/Manager';
import Financial from './pages/Financial';
import Compliance from './pages/Compliance';
import PatientExperience from './pages/PatientExperience';
import Schedule from './pages/Schedule';
import Patients from './pages/Patients';
import Forms from './pages/Forms';
import Analytics from './pages/Analytics';
import EHR from './pages/EHR';
import Billing from './pages/Billing';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { TenantProvider } from './contexts/TenantContext';
import { QueryClient } from '@tanstack/react-query';
import { AdvancedAnalytics } from '@/pages/AdvancedAnalytics';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <DashboardProvider>
            <AnalyticsProvider>
              <QueryClient>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                  <Route path="/manager" element={<Manager />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/patient-experience" element={<PatientExperience />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/forms" element={<Forms />} />
                  <Route path="/ehr" element={<EHR />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </QueryClient>
            </AnalyticsProvider>
          </DashboardProvider>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
