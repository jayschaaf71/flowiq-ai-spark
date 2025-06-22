import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { TenantCreateDialog } from './TenantCreateDialog';
import { TenantSettingsDialog } from './TenantSettingsDialog';
import { TenantUsersManager } from './TenantUsersManager';
import { TenantBrandingSettings } from './TenantBrandingSettings';
import { 
  Building2, 
  Users, 
  Settings, 
  Plus, 
  Crown, 
  Globe, 
  Palette,
  BarChart3,
  Shield
} from 'lucide-react';

export const TenantAdminDashboard: React.FC = () => {
  const { tenants, tenantsLoading, currentTenant } = useTenantManagement();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'enterprise': return Crown;
      case 'professional': return Shield;
      case 'basic': return Building2;
      default: return Building2;
    }
  };

  if (tenantsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">Loading Tenant Dashboard</h3>
          <p className="text-gray-600">Please wait while we load your tenant information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Administration</h1>
          <p className="text-gray-600">Manage multi-tenant enterprise features</p>
        </div>
        <TenantCreateDialog />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                <p className="text-2xl font-bold">{tenants?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">
                  {tenants?.reduce((sum, t) => sum + (t.max_users || 0), 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Enterprise</p>
                <p className="text-2xl font-bold">
                  {tenants?.filter(t => t.subscription_tier === 'enterprise').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-cyan-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">White Label</p>
                <p className="text-2xl font-bold">
                  {tenants?.filter(t => t.white_label_enabled).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tenants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tenants?.map((tenant) => {
              const TierIcon = getTierIcon(tenant.subscription_tier);
              return (
                <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tenant.brand_name}</CardTitle>
                          <CardDescription>{tenant.specialty}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getTierColor(tenant.subscription_tier)}>
                        <TierIcon className="w-3 h-3 mr-1" />
                        {tenant.subscription_tier}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Domain:</span>
                        <span>{tenant.domain || tenant.subdomain || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Max Forms:</span>
                        <span>{tenant.max_forms}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Max Users:</span>
                        <span>{tenant.max_users}</span>
                      </div>
                      <div className="flex space-x-2 pt-3">
                        {tenant.custom_branding_enabled && (
                          <Badge variant="outline">
                            <Palette className="w-3 h-3 mr-1" />
                            Custom Branding
                          </Badge>
                        )}
                        {tenant.api_access_enabled && (
                          <Badge variant="outline">
                            <Settings className="w-3 h-3 mr-1" />
                            API Access
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2 pt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setSettingsDialogOpen(true);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <TenantUsersManager />
        </TabsContent>

        <TabsContent value="branding">
          <TenantBrandingSettings />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Analytics</CardTitle>
              <CardDescription>Usage metrics and performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Comprehensive tenant analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedTenant && (
        <TenantSettingsDialog
          tenant={selectedTenant}
          open={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
        />
      )}
    </div>
  );
};
