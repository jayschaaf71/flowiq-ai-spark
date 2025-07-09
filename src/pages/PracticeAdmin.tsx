import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PracticeAdminSidebar } from '@/components/practice/PracticeAdminSidebar';
import { PracticeAdminDashboard } from '@/components/practice/PracticeAdminDashboard';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserMenu } from '@/components/auth/UserMenu';
import { TenantSwitcher } from '@/components/tenant/TenantSwitcher';
import { PracticePatients } from '@/components/practice/PracticePatients';
import { PracticeStaff } from '@/components/practice/PracticeStaff';
import { PracticeScheduling } from '@/components/practice/PracticeScheduling';
import { PracticeBilling } from '@/components/practice/PracticeBilling';
import { PracticeReports } from '@/components/practice/PracticeReports';
import { PracticeSettings } from '@/components/practice/PracticeSettings';

const PracticeAdmin = () => {
  return (
    <RoleGuard allowedRoles={['practice_admin']}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <PracticeAdminSidebar />
          <SidebarInset className="flex-1">
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
              <div className="flex flex-1 items-center justify-end gap-3 px-4">
                <TenantSwitcher />
                <UserMenu />
              </div>
            </header>
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route index element={<PracticeAdminDashboard />} />
                <Route path="patients" element={<PracticePatients />} />
                <Route path="staff" element={<PracticeStaff />} />
                <Route path="scheduling" element={<PracticeScheduling />} />
                <Route path="billing" element={<PracticeBilling />} />
                <Route path="reports" element={<PracticeReports />} />
                <Route path="settings" element={<PracticeSettings />} />
              </Routes>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
};

export default PracticeAdmin;