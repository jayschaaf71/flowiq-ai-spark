
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserMenu } from "./auth/UserMenu";
import { useTenantConfig } from "@/utils/tenantConfig";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const tenantConfig = useTenantConfig();
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex flex-1 items-center justify-between px-4">
              <h1 className="text-2xl font-semibold">
                <span className={`text-${tenantConfig.primaryColor}-600`}>
                  {tenantConfig.brandName}
                </span>
                <span className="text-gray-700 text-lg ml-2">Admin</span>
              </h1>
              <UserMenu />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
