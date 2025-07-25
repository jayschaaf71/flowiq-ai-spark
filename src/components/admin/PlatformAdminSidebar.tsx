import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Shield, 
  Users, 
  Server, 
  Database, 
  AlertTriangle,
  Settings,
  Building,
  Activity,
  Sparkles,
  DollarSign,
  FileText,
  TrendingUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const adminNavItems = [
  {
    group: "overview",
    items: [
      { path: "/platform-admin", icon: BarChart3, label: "Dashboard", exact: true },
      { path: "/platform-admin/analytics", icon: Activity, label: "Analytics" },
    ]
  },
  {
    group: "financial",
    items: [
      { path: "/platform-admin/costs", icon: DollarSign, label: "Cost Analysis" },
      { path: "/platform-admin/reports", icon: FileText, label: "Financial Reports" },
    ]
  },
  {
    group: "management", 
    items: [
      { path: "/platform-admin/tenants", icon: Building, label: "Tenants" },
      { path: "/platform-admin/users", icon: Users, label: "Users" },
      { path: "/platform-admin/security", icon: Shield, label: "Security" },
    ]
  },
  {
    group: "system",
    items: [
      { path: "/platform-admin/infrastructure", icon: Server, label: "Infrastructure" },
      { path: "/platform-admin/database", icon: Database, label: "Database" },
      { path: "/platform-admin/alerts", icon: AlertTriangle, label: "Alerts" },
    ]
  },
  {
    group: "configuration",
    items: [
      { path: "/platform-admin/settings", icon: Settings, label: "Settings" },
    ]
  }
];

export const PlatformAdminSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white flex-shrink-0">
            <Sparkles className="h-7 w-7" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xl truncate">FlowIQ AI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-tight truncate">
                Platform Administration
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-4 p-2">
          {adminNavItems.map((group) => (
            <SidebarGroup key={group.group}>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                {group.group === "overview" && "Overview"}
                {group.group === "financial" && "Financial"}
                {group.group === "management" && "Management"}
                {group.group === "system" && "System"}
                {group.group === "configuration" && "Configuration"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path, item.exact)} className="w-full">
                        <NavLink 
                          to={item.path} 
                          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <span className="truncate font-medium">{item.label}</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};