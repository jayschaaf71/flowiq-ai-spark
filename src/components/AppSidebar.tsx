
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
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
import { getNavItems, getNavGroups } from "@/config/navigationConfig";
import { sidebarService } from "@/services/sidebarService";
import { User } from "lucide-react";

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const tenantConfig = useTenantConfig();
  const { isPlatformAdmin, hasMinimumRole, primaryTenant, user } = useEnhancedAuth();
  const { getBrandName } = useSpecialty();
  const [sessionStartTime] = useState(Date.now());
  const [agentStatus, setAgentStatus] = useState<Record<string, boolean>>({});

  // Load agent licensing status
  useEffect(() => {
    sidebarService.getAgentStatus().then(setAgentStatus);
  }, []);

  // Get specialty-specific navigation items with role-based filtering
  const currentSpecialty = localStorage.getItem('currentSpecialty') || 'chiropractic';
  const userRole = user?.role || 'staff'; // Default to staff role
  const navItems = getNavItems(currentSpecialty, userRole);
  const navGroups = getNavGroups(userRole);

  // Handle deep linking
  useEffect(() => {
    const unsubscribe = sidebarService.onOpen((itemId: string) => {
      const item = navItems.find(nav => nav.id === itemId);
      if (item) {
        navigate(item.path);
      }
    });
    return unsubscribe;
  }, [navigate, navItems]);

  // Filter navigation items based on licensing
  const filteredNavItems = navItems.filter(item => {
    // Check licensing
    if (item.requiredLicense && !agentStatus[item.id]) {
      return false;
    }

    // Role filtering is now handled in getNavItems
    return true;
  });

  // Group filtered items
  const groupedItems = navGroups
    .map(group => ({
      ...group,
      items: filteredNavItems
        .filter(item => item.group === group.id)
        .sort((a, b) => a.order - b.order)
    }))
    .filter(group => group.items.length > 0)
    .sort((a, b) => a.order - b.order);

  const handleNavClick = (item: { id?: string; path: string }) => {
    sidebarService.logNavClick(item.id || item.path, sessionStartTime);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="border-r bg-gradient-to-b from-background to-background/95 w-64 fixed left-0 top-0 h-full z-10">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-accent text-primary-foreground shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg truncate">{tenantConfig?.brand_name || getBrandName()}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-tight truncate">
                {tenantConfig?.tagline || 'Expert Healthcare Management'}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {groupedItems.map((group) => (
          <SidebarGroup key={group.id} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id} asChild>
                    <NavLink
                      to={item.path}
                      onClick={() => handleNavClick(item)}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs px-1.5 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <User className="h-4 w-4" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {userRole}
              </p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </div>
  );
};
