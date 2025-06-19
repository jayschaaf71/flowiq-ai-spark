
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
  Brain,
  Calendar,
  ClipboardList,
  Bell,
  CreditCard,
  Receipt,
  MessageSquare,
  Stethoscope,
  UserPlus,
  Building2,
  Activity
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
    { icon: Brain, label: "Manager Agent", path: "/manager", badge: "AI" },
    { icon: Workflow, label: "Workflows", path: "/workflows", badge: "12" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", badge: null },
    { icon: Zap, label: "AI Insights", path: "/insights", badge: "3" },
  ];

  const practiceManagement = [
    { icon: UserPlus, label: "Patients", path: "/patients", badge: null },
    { icon: Users, label: "Team", path: "/team", badge: null },
    { icon: Building2, label: "Practice Setup", path: "/setup", badge: null },
  ];

  const aiAgents = [
    { icon: Calendar, label: "Schedule iQ", path: "/agents/schedule", badge: "AI" },
    { icon: ClipboardList, label: "Intake iQ", path: "/agents/intake", badge: "AI" },
    { icon: Bell, label: "Remind iQ", path: "/agents/remind", badge: "AI" },
    { icon: CreditCard, label: "Billing iQ", path: "/agents/billing", badge: "AI" },
    { icon: Receipt, label: "Claims iQ", path: "/agents/claims", badge: "AI" },
    { icon: MessageSquare, label: "Assist iQ", path: "/agents/assist", badge: "AI" },
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
                      variant={item.badge === "AI" ? "default" : "secondary"} 
                      className={`ml-auto text-xs ${
                        item.badge === "AI" ? "bg-blue-100 text-blue-700" : ""
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
          <div className="relative">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg border border-blue-200">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Activity className="h-2.5 w-2.5 text-white" />
            </div>
          </div>
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
