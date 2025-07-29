
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserMenu } from "./auth/UserMenu";
import { TenantSwitcher } from "./tenant/TenantSwitcher";
import { FloatingAssistIQ } from "./FloatingAssistIQ";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  console.log('📱 Layout: Rendering Layout component');
  console.log('📱 Layout: Current URL:', window.location.href);
  console.log('📱 Layout: Current pathname:', window.location.pathname);
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
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
            {children}
          </main>
        </SidebarInset>
        
        {/* Floating Sage AI Assistant */}
        <FloatingAssistIQ />
      </div>
    </SidebarProvider>
  );
};
