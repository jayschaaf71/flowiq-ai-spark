import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { DashboardProvider } from './contexts/DashboardContext';
import { SpecialtyProvider } from './contexts/SpecialtyContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

// Dedicated Specialty Apps
import ChiropracticApp from './apps/ChiropracticApp';
import DentalSleepApp from './apps/DentalSleepApp';
import GeneralDentistryApp from './apps/GeneralDentistryApp';
import OrthodonticsApp from './apps/OrthodonticsApp';
import VeterinaryApp from './apps/VeterinaryApp';
import ConciergeMedicineApp from './apps/ConciergeMedicineApp';
import HRTApp from './apps/HRTApp';
import MedspaApp from './apps/MedspaApp';
import PhysicalTherapyApp from './apps/PhysicalTherapyApp';
import MentalHealthApp from './apps/MentalHealthApp';
import DermatologyApp from './apps/DermatologyApp';
import UrgentCareApp from './apps/UrgentCareApp';
import CommunicationIQApp from './apps/CommunicationIQApp';
import MainDashboard from './components/MainDashboard';

// Shared pages
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PatientDashboard } from './pages/PatientDashboard';
import PatientJourney from './pages/PatientJourney';
import PatientNotifications from './pages/PatientNotifications';
import PatientSettings from './pages/PatientSettings';
import PatientMessages from './pages/PatientMessages';
import ResetPassword from './pages/ResetPassword';
import AcceptInvitation from './pages/AcceptInvitation';
import AuthTesting from './pages/AuthTesting';

// Platform Admin
import PlatformAdmin from './pages/PlatformAdmin';
import PracticeAdmin from './pages/PracticeAdmin';
import TenantOnboarding from './pages/TenantOnboarding';

// Public pages
import { PatientPortal } from './pages/PatientPortal';
import PatientIntakeForm from './pages/PatientIntakeForm';
import { EmbeddedPortal } from './pages/EmbeddedPortal';
import { BookingWidgetDemo } from './pages/BookingWidgetDemo';
import BookingWidgetPage from './pages/BookingWidget';

// Demo pages
import { DemoHub } from './pages/demo/DemoHub';
import { DemoChiropractic } from './pages/demo/DemoChiropractic';
import { DemoDental } from './pages/demo/DemoDental';
import { DemoMedSpa } from './pages/demo/DemoMedSpa';
import DentalSleepDemo from './pages/DentalSleepDemo';

import { Toaster } from './components/ui/toaster';
import { FloatingAssistIQ } from './components/FloatingAssistIQ';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProductionTenantProvider } from './components/tenant/ProductionTenantProvider';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ProductionTenantProvider>
              <SpecialtyProvider>
                <DashboardProvider>
                  <AnalyticsProvider>
                  <Routes>
                    {/* Landing and Auth Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/get-started" element={<AuthPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
                    <Route path="/auth-testing" element={<AuthTesting />} />

                    {/* Dedicated Specialty Apps */}
                    <Route path="/chiropractic/*" element={<ChiropracticApp />} />
                    <Route path="/dental-sleep/*" element={<DentalSleepApp />} />
                    <Route path="/general-dentistry/*" element={<GeneralDentistryApp />} />
                    <Route path="/orthodontics/*" element={<OrthodonticsApp />} />
                    <Route path="/veterinary/*" element={<VeterinaryApp />} />
                    <Route path="/concierge-medicine/*" element={<ConciergeMedicineApp />} />
                    <Route path="/hrt/*" element={<HRTApp />} />
                    <Route path="/medspa/*" element={<MedspaApp />} />
                    <Route path="/physical-therapy/*" element={<PhysicalTherapyApp />} />
                    <Route path="/mental-health/*" element={<MentalHealthApp />} />
                    <Route path="/dermatology/*" element={<DermatologyApp />} />
                    <Route path="/urgent-care/*" element={<UrgentCareApp />} />
                    <Route path="/communication-iq/*" element={<CommunicationIQApp />} />
                    

                    {/* Patient Routes */}
                    <Route path="/patient-dashboard" element={
                      <ProtectedRoute>
                        <PatientDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient-journey" element={
                      <ProtectedRoute>
                        <PatientJourney />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/notifications" element={
                      <ProtectedRoute>
                        <PatientNotifications />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/settings" element={
                      <ProtectedRoute>
                        <PatientSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/patient/messages" element={
                      <ProtectedRoute>
                        <PatientMessages />
                      </ProtectedRoute>
                    } />

                    {/* Public Patient-facing Routes */}
                    <Route path="/patient-portal" element={<PatientPortal />} />
                    <Route path="/patient-intake/:formId" element={<PatientIntakeForm />} />
                    <Route path="/embedded-portal" element={<EmbeddedPortal />} />
                    <Route path="/booking-widget" element={<BookingWidgetDemo />} />
                    <Route path="/widget" element={<BookingWidgetPage />} />

                    {/* Platform Administration */}
                    <Route path="/platform-admin/*" element={
                      <ProtectedRoute requiredRole="platform_admin">
                        <PlatformAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/practice-admin/*" element={
                      <ProtectedRoute requiredRole="practice_admin">
                        <PracticeAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding/:tenantId" element={
                      <ProtectedRoute>
                        <TenantOnboarding />
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding" element={
                      <ProtectedRoute>
                        <TenantOnboarding />
                      </ProtectedRoute>
                    } />

                    {/* Demo Routes */}
                    <Route path="/demo" element={<DemoHub />} />
                    <Route path="/demo/chiropractic" element={<DemoChiropractic />} />
                    <Route path="/demo/dental" element={<DemoDental />} />
                    <Route path="/demo/medspa" element={<DemoMedSpa />} />
                    <Route path="/dental-sleep-demo" element={<DentalSleepDemo />} />

                    {/* Legacy Route Redirects - for backwards compatibility */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute requiredRole="staff">
                        <MainDashboard />
                      </ProtectedRoute>
                    } />
                  </Routes>
                  <FloatingAssistIQ />
                  <Toaster />
                  </AnalyticsProvider>
                </DashboardProvider>
              </SpecialtyProvider>
            </ProductionTenantProvider>
          </QueryClientProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;