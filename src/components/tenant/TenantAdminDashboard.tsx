
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tenants?.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                onSettingsClick={handleSettingsClick}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <TenantUsersManager />
        </TabsContent>

        <TabsContent value="branding">
          <TenantBrandingSettings />
        </TabsContent>

        <TabsContent value="analytics">
          <TenantAnalyticsTab />
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
