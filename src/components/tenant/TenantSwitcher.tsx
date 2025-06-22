
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';

export const TenantSwitcher: React.FC = () => {
  const { userRoles, primaryTenant } = useEnhancedAuth();

  if (!userRoles || userRoles.length <= 1) {
    return null; // Don't show switcher if user only has access to one tenant
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'bg-purple-100 text-purple-800';
      case 'tenant_admin': return 'bg-red-100 text-red-800';
      case 'practice_manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTenantSwitch = (tenantId: string) => {
    // This would typically update the user's primary tenant preference
    // For now, we'll just log it - this would need backend implementation
    console.log('Switching to tenant:', tenantId);
    // TODO: Implement tenant switching logic
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span className="truncate max-w-32">
            {primaryTenant?.tenant.brand_name || 'Select Tenant'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch Tenant</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userRoles.map((userRole) => (
          <DropdownMenuItem
            key={userRole.tenant_id}
            onClick={() => handleTenantSwitch(userRole.tenant_id)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">
                  {userRole.tenant.brand_name}
                </span>
                {primaryTenant?.tenant_id === userRole.tenant_id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {userRole.tenant.specialty}
                </span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getRoleColor(userRole.role)}`}
                >
                  {userRole.role.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
