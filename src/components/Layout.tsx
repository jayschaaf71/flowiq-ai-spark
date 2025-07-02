
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserMenu } from "./auth/UserMenu";
import { TenantSwitcher } from "./tenant/TenantSwitcher";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* SIDEBAR AREA - BRIGHT RED BORDER FOR DEBUGGING */}
        <div className="border-4 border-red-500 bg-red-100">
          <AppSidebar />
        </div>
        
        {/* MAIN CONTENT AREA - BRIGHT BLUE BORDER FOR DEBUGGING */}
        <div className="flex-1 border-4 border-blue-500 bg-blue-100">
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
            <div className="bg-green-200 border-2 border-green-500 p-4">
              <h1 className="text-2xl font-bold text-black mb-4">🚨 MAIN CONTENT AREA 🚨</h1>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
