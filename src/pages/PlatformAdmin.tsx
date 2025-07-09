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

const PlatformAdmin = () => {
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
                <Route path="tenants" element={<PlatformTenants />} />
                <Route path="users" element={<PlatformUsers />} />
                <Route path="security" element={<PlatformSecurity />} />
                <Route path="infrastructure" element={<PlatformInfrastructure />} />
                <Route path="database" element={<PlatformDatabase />} />
                <Route path="alerts" element={<PlatformAlerts />} />
                <Route path="settings" element={<PlatformSettings />} />
              </Routes>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PlatformAdminAccessWrapper>
  );
};

export default PlatformAdmin;