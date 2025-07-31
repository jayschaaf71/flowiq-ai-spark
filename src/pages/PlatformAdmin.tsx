import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PlatformAdminSidebar } from '@/components/admin/PlatformAdminSidebar';
import { PlatformAdminDashboard } from '@/components/admin/PlatformAdminDashboard';
import { PlatformAdminAccessWrapper } from '@/components/admin/PlatformAdminAccessWrapper';
import { UserMenu } from '@/components/auth/UserMenu';
import { PlatformAnalytics } from '@/components/admin/PlatformAnalytics';
import { PlatformTenants } from '@/components/admin/PlatformTenants';
import { PlatformUsers } from '@/components/admin/PlatformUsers';
import { PlatformSecurity } from '@/components/admin/PlatformSecurity';
import { PlatformInfrastructure } from '@/components/admin/PlatformInfrastructure';
import { PlatformDatabase } from '@/components/admin/PlatformDatabase';
import { PlatformAlerts } from '@/components/admin/PlatformAlerts';
import { PlatformSettings } from '@/components/admin/PlatformSettings';
import { CostAnalyticsDashboard } from '@/components/admin/CostAnalyticsDashboard';
import { FinancialReportingDashboard } from '@/components/admin/FinancialReportingDashboard';
import { TenantDetails } from '@/components/admin/TenantDetails';
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/hooks/useAuth';

// Simple test component
const TestComponent = () => (
  <div style={{ padding: '20px', backgroundColor: 'green', color: 'white' }}>
    <h1>TEST COMPONENT WORKING!</h1>
    <p>This is a simple test component.</p>
  </div>
);

// Inline debug component (replacing the import)
const InlineDebug = () => {
  console.log('🔧 [InlineDebug] Component rendering');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
      <h1>INLINE DEBUG WORKING!</h1>
      <p>This is an inline debug component.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>URL: {window.location.href}</p>
    </div>
  );
};

// Direct debug component that bypasses all wrappers
const DirectDebug = () => (
  <div style={{ padding: '20px', backgroundColor: 'blue', color: 'white' }}>
    <h1>DIRECT DEBUG WORKING!</h1>
    <p>This bypasses all wrappers and access controls.</p>
    <p>Timestamp: {new Date().toISOString()}</p>
    <p>URL: {window.location.href}</p>
  </div>
);

const PlatformAdmin = () => {
  const { user, loading } = useAuth();

  console.log('🔧 [PlatformAdmin] Component rendered', { user, loading });

  // Show loading state while checking authentication
  if (loading) {
    console.log('🔧 [PlatformAdmin] Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    console.log('🔧 [PlatformAdmin] No user, showing login');
    return <AuthPage />;
  }

  console.log('🔧 [PlatformAdmin] User authenticated, showing dashboard');
  // Show platform admin dashboard if user is authenticated
  return (
    <PlatformAdminAccessWrapper>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <PlatformAdminSidebar />
          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
              <div className="flex flex-1 items-center justify-end gap-3 px-4">
                <UserMenu />
              </div>
            </header>
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route index element={<PlatformAdminDashboard />} />
                <Route path="analytics" element={<PlatformAnalytics />} />
                <Route path="costs" element={<CostAnalyticsDashboard />} />
                <Route path="reports" element={<FinancialReportingDashboard />} />
                <Route path="tenants" element={<PlatformTenants />} />
                <Route path="tenants/:id" element={<TenantDetails />} />
                <Route path="tenants/:id/details" element={<TenantDetails />} />
                <Route path="users" element={<PlatformUsers />} />
                <Route path="security" element={<PlatformSecurity />} />
                <Route path="infrastructure" element={<PlatformInfrastructure />} />
                <Route path="database" element={<PlatformDatabase />} />
                <Route path="alerts" element={<PlatformAlerts />} />
                <Route path="settings" element={<PlatformSettings />} />
                <Route path="debug" element={<InlineDebug />} />
                <Route path="test" element={<TestComponent />} />
                <Route path="direct" element={<DirectDebug />} />
              </Routes>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PlatformAdminAccessWrapper>
  );
};

export default PlatformAdmin;