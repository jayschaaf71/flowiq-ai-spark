
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
import { getNavItems, navGroups } from "@/config/navigationConfig";
import { sidebarService } from "@/services/sidebarService";

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

  // Get specialty-specific navigation items
  const currentSpecialty = localStorage.getItem('currentSpecialty') || 'chiropractic';
  const navItems = getNavItems(currentSpecialty);

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
  
  // Filter navigation items based on role and licensing
  const filteredNavItems = navItems.filter(item => {
    // Check licensing
    if (item.requiredLicense && !agentStatus[item.id]) {
      return false;
    }
    
    // Check role requirements
    if (item.requiredRole && !hasMinimumRole(item.requiredRole)) {
      return false;
    }

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

  const handleNavClick = (item: any) => {
    sidebarService.logNavClick(item.id || item.path, sessionStartTime);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex-shrink-0">
            <Sparkles className="h-4 w-4" />
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
          {groupedItems.map((group) => (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={isActive(item.path)} className="w-full">
                        <NavLink 
                          to={item.path} 
                          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleNavClick(item)}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <>
                              <span className="truncate font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge 
                                  variant={item.badge === "AI" ? "default" : "secondary"} 
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
          ))}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        {/* Additional management items if needed */}
      </SidebarFooter>
    </Sidebar>
  );
};
