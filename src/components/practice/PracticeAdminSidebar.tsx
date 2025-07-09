import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  UserCheck,
  Building2
} from 'lucide-react';

const practiceAdminItems = [
  {
    title: "Dashboard",
    url: "/practice-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    url: "/practice-admin/patients",
    icon: Users,
  },
  {
    title: "Staff",
    url: "/practice-admin/staff",
    icon: UserCheck,
  },
  {
    title: "Scheduling",
    url: "/practice-admin/scheduling",
    icon: Calendar,
  },
  {
    title: "Billing",
    url: "/practice-admin/billing",
    icon: DollarSign,
  },
  {
    title: "Reports",
    url: "/practice-admin/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/practice-admin/settings",
    icon: Settings,
  },
];

export function PracticeAdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/practice-admin") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) =>
    isActive(path) 
      ? "bg-accent text-accent-foreground font-medium" 
      : "hover:bg-accent/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5" />
            {!isCollapsed && "Practice Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {practiceAdminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/practice-admin"}
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}