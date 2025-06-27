
import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Database, 
  BarChart3, 
  Settings, 
  HelpCircle,
  ClipboardList,
  Bell,
  CreditCard,
  Receipt,
  UserCheck,
  TrendingUp,
  Stethoscope,
  Building2,
  UserPlus,
  MessageSquare,
  Brain,
  Calendar,
  Package,
  CheckSquare,
  Clock
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTenantConfig } from "@/utils/enhancedTenantConfig";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";

export const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const tenantConfig = useTenantConfig();
  const { isPlatformAdmin, hasMinimumRole, primaryTenant } = useEnhancedAuth();
  
  const mainNavigationItems = [
    { icon: Home, label: "Dashboard", path: "/", badge: null },
    { icon: Users, label: "Patients", path: "/patient-management", badge: null },
    { icon: Database, label: "EHR", path: "/ehr", badge: null },
    { icon: TrendingUp, label: "Insights", path: "/insights", badge: null },
  ];

  // Clinical Operations - NEW SECTION
  const clinicalOperations = [
    { icon: CheckSquare, label: "Patient Check-In", path: "/checkin", badge: "New" },
    { icon: Bell, label: "Notifications", path: "/notifications", badge: "New" },
    { icon: Clock, label: "Provider Scheduling", path: "/provider-scheduling", badge: "New" },
  ];

  // Reordered AI agents to match patient journey flow, with new Inventory IQ
  const aiAgents = [
    { icon: Calendar, label: "Schedule iQ", path: "/agents/schedule", badge: "AI" },
    { icon: ClipboardList, label: "Intake iQ", path: "/agents/intake", badge: "AI" },
    { icon: Bell, label: "Reminders iQ", path: "/agents/remind", badge: "AI" },
    { icon: Stethoscope, label: "Scribe iQ", path: "/agents/scribe", badge: "AI" },
    { icon: Receipt, label: "Claims iQ", path: "/agents/claims", badge: "AI" },
    { icon: CreditCard, label: "Billing iQ", path: "/agents/billing", badge: "AI" },
    { icon: Package, label: "Inventory iQ", path: "/agents/inventory", badge: "AI" },
    { icon: MessageSquare, label: "Follow up iQ", path: "/agents/followup", badge: "AI" },
    { icon: Brain, label: "Insight iQ", path: "/agents/insight", badge: "AI" },
  ];

  const managementItems = [
    { icon: UserPlus, label: "Manager Agent", path: "/manager", badge: "AI" },
    ...(hasMinimumRole('practice_manager') ? [{ icon: Users, label: "Team", path: "/team", badge: null }] : []),
    ...(hasMinimumRole('tenant_admin') ? [{ icon: Building2, label: "Practice Setup", path: "/setup", badge: null }] : []),
    ...(isPlatformAdmin ? [{ icon: Building2, label: "Tenant Admin", path: "/tenant-admin", badge: "Enterprise" }] : []),
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderNavSection = (title: string, items: any[]) => (
    <SidebarGroup key={title}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)}>
                <NavLink to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "AI" ? "default" : item.badge === "Enterprise" ? "secondary" : item.badge === "New" ? "destructive" : "secondary"} 
                      className={`ml-auto text-xs ${
                        item.badge === "AI" ? "bg-blue-100 text-blue-700" : 
                        item.badge === "Enterprise" ? "bg-purple-100 text-purple-700" : 
                        item.badge === "New" ? "bg-green-100 text-green-700" : ""
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          {state === "expanded" && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-blue-600">Flow</span>
                <span className="font-bold text-lg text-gray-800">iQ</span>
              </div>
              <p className="text-xs text-gray-500 leading-tight">
                {tenantConfig.tagline}
              </p>
              {primaryTenant && (
                <p className="text-xs text-blue-600 font-medium mt-1">
                  {primaryTenant.tenant.brand_name}
                </p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {renderNavSection("Main", mainNavigationItems)}
        {renderNavSection("Clinical Operations", clinicalOperations)}
        {renderNavSection("AI Assistants", aiAgents)}
        {renderNavSection("Management", managementItems)}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)}>
                <NavLink to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
