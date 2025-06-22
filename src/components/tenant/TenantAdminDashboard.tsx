
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { TenantCreateDialog } from './TenantCreateDialog';
import { TenantSettingsDialog } from './TenantSettingsDialog';
import { TenantUsersManager } from './TenantUsersManager';
import { TenantBrandingSettings } from './TenantBrandingSettings';
import { TenantStatsCards } from './TenantStatsCards';
import { TenantCard } from './TenantCard';
import { TenantAnalyticsTab } from './TenantAnalyticsTab';
import { TenantAnalyticsCharts } from './TenantAnalyticsCharts';
import { TenantBrandingCustomizer } from './TenantBrandingCustomizer';
import { TenantSettingsManager } from './TenantSettingsManager';
import { TenantUserInviteDialog } from './TenantUserInviteDialog';
import { TenantLoadingState } from './TenantLoadingState';

export const TenantAdminDashboard: React.FC = () => {
  const { tenants, tenantsLoading } = useTenantManagement();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);

  const handleSettingsClick = (tenant: any) => {
    setSelectedTenant(tenant);
    setSettingsDialogOpen(true);
  };

  if (tenantsLoading) {
    return <TenantLoadingState />;
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
      <TenantStatsCards tenants={tenants} />

      {/* Main Content */}
      <Tabs defaultValue="tenants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tenants?.map((tenant) => (
              <div key={tenant.id} className="space-y-3">
                <TenantCard
                  tenant={tenant}
                  onSettingsClick={handleSettingsClick}
                />
                <div className="flex justify-center">
                  <TenantUserInviteDialog
                    tenantId={tenant.id}
                    tenantName={tenant.brand_name}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <TenantAnalyticsCharts />
        </TabsContent>

        <TabsContent value="users">
          <TenantUsersManager />
        </TabsContent>

        <TabsContent value="branding">
          <div className="space-y-6">
            {tenants?.map((tenant) => (
              <TenantBrandingCustomizer key={tenant.id} tenant={tenant} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-8">
            {tenants?.map((tenant) => (
              <TenantSettingsManager key={tenant.id} tenant={tenant} />
            ))}
          </div>
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
