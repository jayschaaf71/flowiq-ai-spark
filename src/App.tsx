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
import SalesIQApp from './apps/SalesIQApp';

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
                    <Route path="/sales-iq/*" element={<SalesIQApp />} />

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
                        <div className="flex items-center justify-center min-h-screen bg-gray-50">
                          <div className="text-center max-w-4xl mx-auto p-8">
                            <h1 className="text-3xl font-bold mb-8">Choose Your Specialty</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <a href="/chiropractic/dashboard" className="block p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                <h3 className="font-semibold text-blue-800">Chiropractic</h3>
                                <p className="text-sm text-blue-600">Spine & musculoskeletal care</p>
                              </a>
                              <a href="/dental-sleep/dashboard" className="block p-4 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                                <h3 className="font-semibold text-green-800">Dental Sleep Medicine</h3>
                                <p className="text-sm text-green-600">Sleep apnea & oral appliances</p>
                              </a>
                              <a href="/general-dentistry/dashboard" className="block p-4 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                                <h3 className="font-semibold text-purple-800">General Dentistry</h3>
                                <p className="text-sm text-purple-600">Comprehensive dental care</p>
                              </a>
                              <a href="/orthodontics/dashboard" className="block p-4 bg-pink-100 rounded-lg hover:bg-pink-200 transition-colors">
                                <h3 className="font-semibold text-pink-800">Orthodontics</h3>
                                <p className="text-sm text-pink-600">Braces & teeth alignment</p>
                              </a>
                              <a href="/veterinary/dashboard" className="block p-4 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors">
                                <h3 className="font-semibold text-yellow-800">Veterinary</h3>
                                <p className="text-sm text-yellow-600">Animal healthcare</p>
                              </a>
                              <a href="/concierge-medicine/dashboard" className="block p-4 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition-colors">
                                <h3 className="font-semibold text-indigo-800">Concierge Medicine</h3>
                                <p className="text-sm text-indigo-600">Personalized healthcare</p>
                              </a>
                              <a href="/hrt/dashboard" className="block p-4 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                                <h3 className="font-semibold text-red-800">HRT Clinics</h3>
                                <p className="text-sm text-red-600">Hormone replacement therapy</p>
                              </a>
                              <a href="/medspa/dashboard" className="block p-4 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors">
                                <h3 className="font-semibold text-teal-800">Medspa</h3>
                                <p className="text-sm text-teal-600">Medical aesthetics</p>
                              </a>
                              <a href="/physical-therapy/dashboard" className="block p-4 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors">
                                <h3 className="font-semibold text-orange-800">Physical Therapy</h3>
                                <p className="text-sm text-orange-600">Rehabilitation & movement</p>
                              </a>
                              <a href="/mental-health/dashboard" className="block p-4 bg-cyan-100 rounded-lg hover:bg-cyan-200 transition-colors">
                                <h3 className="font-semibold text-cyan-800">Mental Health</h3>
                                <p className="text-sm text-cyan-600">Therapy & counseling</p>
                              </a>
                              <a href="/dermatology/dashboard" className="block p-4 bg-lime-100 rounded-lg hover:bg-lime-200 transition-colors">
                                <h3 className="font-semibold text-lime-800">Dermatology</h3>
                                <p className="text-sm text-lime-600">Skin health & aesthetics</p>
                              </a>
                              <a href="/urgent-care/dashboard" className="block p-4 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors">
                                <h3 className="font-semibold text-amber-800">Urgent Care</h3>
                                <p className="text-sm text-amber-600">Immediate medical care</p>
                              </a>
                              <a href="/communication-iq" className="col-span-full block p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg hover:from-blue-200 hover:to-purple-200 border-2 border-dashed border-blue-300 transition-colors">
                                <h3 className="font-semibold text-blue-800 text-lg">Communication IQ</h3>
                                <p className="text-blue-600">AI-powered communication system for any business</p>
                              </a>
                            </div>
                          </div>
                        </div>
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