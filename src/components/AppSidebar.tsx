
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
  Clock,
  DollarSign,
  Heart,
  Shield
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
    { icon: Home, label: "Dashboard", path: "/dashboard", badge: null },
    { icon: Users, label: "Patients", path: "/patient-management", badge: null },
    { icon: Database, label: "EHR", path: "/ehr", badge: null },
    { icon: TrendingUp, label: "Insights", path: "/insights", badge: null },
  ];

  // New grouped navigation structure
  const appointmentsGroup = [
    { icon: Calendar, label: "Appointment iQ", path: "/agents/appointment", badge: "AI" },
  ];

  const clinicalSupportGroup = [
    { icon: Stethoscope, label: "Scribe iQ", path: "/agents/scribe", badge: "AI" },
    { icon: Brain, label: "Insights iQ", path: "/agents/insights", badge: "AI" },
  ];

  const patientOperationsGroup = [
    { icon: ClipboardList, label: "Intake iQ", path: "/agents/intake", badge: "AI" },
  ];

  const revenueCycleGroup = [
    { icon: Receipt, label: "Claims iQ", path: "/agents/claims", badge: "AI" },
    { icon: CreditCard, label: "Payments iQ", path: "/agents/payments", badge: "AI" },
  ];

  const practiceOpsGroup = [
    { icon: Package, label: "Inventory iQ", path: "/agents/inventory", badge: "AI" },
    { icon: UserPlus, label: "Ops iQ", path: "/ops", badge: "AI" },
  ];

  const managementItems = [
    { icon: Building2, label: "Beta Pilot", path: "/pilot", badge: "Live" },
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
      <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)} className="hover:bg-gray-50">
                <NavLink to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant={item.badge === "AI" ? "default" : item.badge === "Enterprise" ? "secondary" : item.badge === "New" ? "destructive" : "secondary"} 
                      className={`ml-auto text-xs flex-shrink-0 ${
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
    <Sidebar variant="inset" className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-3">
          {state === "expanded" && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-blue-600">Flow</span>
                <span className="font-bold text-lg text-gray-800">iQ</span>
              </div>
              <p className="text-xs text-gray-500 leading-tight truncate">
                {tenantConfig.tagline}
              </p>
              {primaryTenant && (
                <p className="text-xs text-blue-600 font-medium mt-1 truncate">
                  {primaryTenant.tenant.brand_name}
                </p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <div className="px-2 py-2 space-y-4">
          {renderNavSection("Main", mainNavigationItems)}
          {renderNavSection("Appointments", appointmentsGroup)}
          {renderNavSection("Clinical Support", clinicalSupportGroup)}
          {renderNavSection("Patient Operations", patientOperationsGroup)}
          {renderNavSection("Revenue Cycle", revenueCycleGroup)}
          {renderNavSection("Practice Ops", practiceOpsGroup)}
          {renderNavSection("Management", managementItems)}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 bg-white">
        <div className="px-2 py-2">
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive(item.path)} className="hover:bg-gray-50">
                  <NavLink to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors">
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
