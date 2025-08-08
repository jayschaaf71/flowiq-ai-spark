import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Settings, Loader, ExternalLink } from 'lucide-react';
import { TenantCreateDialog } from '@/components/tenant/TenantCreateDialog';
import { useRealPlatformMetrics } from '@/hooks/useRealPlatformMetrics';

export const PlatformTenants = () => {
  const { tenants, loading } = useRealPlatformMetrics();
  const navigate = useNavigate();

  console.log('🔧 [PlatformTenants] Component rendered', { tenants, loading });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading tenants...</span>
        </div>
      </div>
    );
  }

  const handleManageTenant = (tenant: any) => {
    console.log('🔧 [PlatformTenants] Managing tenant:', tenant);
    // Navigate to tenant management page
    navigate(`/platform-admin/tenants/${tenant.id}`, { 
      state: { tenant } 
    });
  };

  const handleViewDetails = (tenant: any) => {
    console.log('🔧 [PlatformTenants] Viewing details for tenant:', tenant);
    // Navigate to tenant details page
    navigate(`/platform-admin/tenants/${tenant.id}/details`, { 
      state: { tenant } 
    });
  };

  const handleVisitTenant = (tenant: any) => {
    console.log('🔧 [PlatformTenants] Visiting tenant:', tenant);
    // Open tenant subdomain in new tab
    const tenantUrl = `https://${tenant.subdomain}.flow-iq.ai`;
    window.open(tenantUrl, '_blank');
  };

  // Debug: Show raw tenant data
  console.log('🔧 [PlatformTenants] Raw tenants data:', tenants);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage all tenant organizations and their configurations</p>
        </div>
        <TenantCreateDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants && tenants.length > 0 ? (
          tenants.map((tenant: any) => (
            <Card key={tenant.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{tenant.name || 'Unnamed Tenant'}</CardTitle>
                <Badge variant={tenant.is_active ? 'default' : 'secondary'}>
                  {tenant.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">0 users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{tenant.specialty || tenant.specialty_type || 'General'}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Type: {tenant.type || 'specialty_clinic'}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Domain: {tenant.subdomain || tenant.slug || 'No domain'}</span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageTenant(tenant)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(tenant)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleVisitTenant(tenant)}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No tenants found</p>
          </div>
        )}
      </div>
    </div>
  );
};