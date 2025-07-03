
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
import { useSpecialty } from "@/contexts/SpecialtyContext";

export const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const tenantConfig = useTenantConfig();
  const { isPlatformAdmin, hasMinimumRole, primaryTenant } = useEnhancedAuth();
  const { getBrandName, theme } = useSpecialty();
  
  const mainNavigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard", badge: null },
    { icon: Users, label: "Patients", path: "/patient-management", badge: null },
    { icon: Database, label: "EHR", path: "/ehr", badge: null },
    { icon: TrendingUp, label: "Insights", path: "/insights", badge: null },
  ];

  // AI Agent Groups
  const aiAgentGroups = [
    {
      title: "Scheduling",
      items: [
        { icon: Calendar, label: "Appointment iQ", path: "/agents/appointment", badge: "AI" },
      ]
    },
    {
      title: "Clinical Support", 
      items: [
        { icon: Stethoscope, label: "Scribe iQ", path: "/agents/scribe", badge: "AI" },
        { icon: Brain, label: "Insights iQ", path: "/agents/insights", badge: "AI" },
      ]
    },
    {
      title: "Patient Operations",
      items: [
        { icon: ClipboardList, label: "Intake iQ", path: "/agents/intake", badge: "AI" },
        { icon: Bell, label: "Remind iQ", path: "/agents/remind", badge: "AI" },
      ]
    },
    {
      title: "Revenue Cycle",
      items: [
        { icon: Receipt, label: "Claims iQ", path: "/agents/claims", badge: "AI" },
        { icon: CreditCard, label: "Payments iQ", path: "/agents/payments", badge: "AI" },
      ]
    },
    {
      title: "Practice Operations",
      items: [
        { icon: Package, label: "Inventory iQ", path: "/agents/inventory", badge: "AI" },
        { icon: UserPlus, label: "Ops iQ", path: "/ops", badge: "AI" },
      ]
    }
  ];

  const managementItems = [
    { icon: Building2, label: "Beta Pilot", path: "/pilot", badge: "Live" },
    ...(hasMinimumRole('practice_manager') ? [{ icon: Users, label: "Team", path: "/team", badge: null }] : []),
    ...(hasMinimumRole('tenant_admin') ? [{ icon: Building2, label: "Practice Setup", path: "/setup", badge: null }] : []),
    ...(isPlatformAdmin ? [{ icon: Shield, label: "Platform Admin", path: "/platform-admin", badge: "Enterprise" }] : []),
    ...(isPlatformAdmin ? [{ icon: Building2, label: "Tenant Admin", path: "/tenant-admin", badge: "Enterprise" }] : []),
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: HelpCircle, label: "AssistIQ", path: "/help" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderNavSection = (title: string, items: any[]) => (
    <SidebarGroup key={title}>
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)} className="w-full">
                <NavLink to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {state === "expanded" && (
                    <>
                      <span className="truncate font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === "AI" ? "default" : item.badge === "Enterprise" ? "secondary" : item.badge === "Live" ? "destructive" : "secondary"} 
                          className="ml-auto text-xs flex-shrink-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
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
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
            <Brain className="h-4 w-4" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg truncate">{getBrandName()}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-tight truncate">
                {tenantConfig.tagline}
              </p>
              {primaryTenant && (
                <p className="text-xs text-primary font-medium mt-1 truncate">
                  {primaryTenant.tenant.brand_name}
                </p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="space-y-4 p-2">
          {renderNavSection("Overview", mainNavigationItems)}
          
          {/* AI Agents Section */}
          <div className="space-y-2">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              AI Agents
            </SidebarGroupLabel>
            {aiAgentGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                {state === "expanded" && (
                  <div className="px-2 py-1">
                    <span className="text-xs text-muted-foreground/80">{group.title}</span>
                  </div>
                )}
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)} className="w-full">
                        <NavLink to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <>
                              <span className="truncate font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="ml-auto text-xs flex-shrink-0">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </div>
            ))}
          </div>

          {renderNavSection("Management", managementItems)}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)} className="w-full">
                <NavLink to={item.path} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {state === "expanded" && (
                    <span className="truncate font-medium">{item.label}</span>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
