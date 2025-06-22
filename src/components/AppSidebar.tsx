
import { NavLink, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Workflow, 
  BarChart3, 
  Settings, 
  Users, 
  Zap, 
  FileText,
  HelpCircle,
  Calendar,
  ClipboardList,
  Bell,
  CreditCard,
  Receipt,
  Stethoscope,
  UserPlus,
  Building2,
  Activity,
  Database,
  UserCheck,
  TrendingUp
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
import { useTenantConfig } from "@/utils/tenantConfig";

export const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  const tenantConfig = useTenantConfig();
  
  const mainNavigationItems = [
    { icon: Home, label: "Dashboard", path: "/", badge: null },
    { icon: Workflow, label: "Workflows", path: "/workflows", badge: "12" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", badge: null },
  ];

  const practiceManagement = [
    { icon: UserPlus, label: "Patients", path: "/patients", badge: null },
    { icon: Users, label: "Team", path: "/team", badge: null },
    { icon: Building2, label: "Practice Setup", path: "/setup", badge: null },
    { icon: Building2, label: "Tenant Admin", path: "/tenant-admin", badge: "Enterprise" },
  ];

  const aiAgents = [
    { icon: Users, label: "Manager Agent", path: "/manager", badge: "AI" },
    { icon: Zap, label: "AI Insights", path: "/insights", badge: "3" },
    { icon: Calendar, label: "Schedule iQ", path: "/agents/schedule", badge: "AI" },
    { icon: ClipboardList, label: "Intake iQ", path: "/agents/intake", badge: "AI" },
    { icon: Bell, label: "Reminders iQ", path: "/agents/remind", badge: "AI" },
    { icon: CreditCard, label: "Billing iQ", path: "/agents/billing", badge: "AI" },
    { icon: Receipt, label: "Claims iQ", path: "/agents/claims", badge: "AI" },
    { icon: Database, label: "EHR iQ", path: "/agents/ehr", badge: "AI" },
    { icon: UserCheck, label: "Follow up iQ", path: "/agents/followup", badge: "AI" },
    { icon: TrendingUp, label: "Insight iQ", path: "/agents/insight", badge: "AI" },
    { icon: Stethoscope, label: "Scribe iQ", path: "/agents/scribe", badge: "AI" },
  ];

  const bottomItems = [
    { icon: FileText, label: "Templates", path: "/templates" },
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
                      variant={item.badge === "AI" ? "default" : item.badge === "Enterprise" ? "secondary" : "secondary"} 
                      className={`ml-auto text-xs ${
                        item.badge === "AI" ? "bg-blue-100 text-blue-700" : 
                        item.badge === "Enterprise" ? "bg-purple-100 text-purple-700" : ""
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
                <span className="font-bold text-lg text-gray-800">IQ</span>
              </div>
              <p className="text-xs text-gray-500 leading-tight">{tenantConfig.tagline}</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {renderNavSection("Main", mainNavigationItems)}
        {renderNavSection("Practice", practiceManagement)}
        {renderNavSection("AI Agents", aiAgents)}
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
