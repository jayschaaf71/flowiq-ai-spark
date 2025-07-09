import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { PlatformAdminSidebar } from '@/components/admin/PlatformAdminSidebar';
import { PlatformAdminDashboard } from '@/components/admin/PlatformAdminDashboard';
import { PlatformAdminAccessWrapper } from '@/components/admin/PlatformAdminAccessWrapper';
import { UserMenu } from '@/components/auth/UserMenu';

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
              <PlatformAdminDashboard />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PlatformAdminAccessWrapper>
  );
};

export default PlatformAdmin;