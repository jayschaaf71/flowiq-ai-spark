
import React from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Tenant } from '@/hooks/useTenantManagement';

interface TenantFeaturesSettingsProps {
  tenant: Tenant;
  setValue: UseFormSetValue<Tenant>;
}

export const TenantFeaturesSettings: React.FC<TenantFeaturesSettingsProps> = ({
  tenant,
  setValue
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Custom Branding</Label>
          <p className="text-sm text-gray-600">Enable custom colors and styling</p>
        </div>
        <Switch
          onCheckedChange={(checked) => setValue('custom_branding_enabled', checked)}
          defaultChecked={tenant.custom_branding_enabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>API Access</Label>
          <p className="text-sm text-gray-600">Allow API integrations</p>
        </div>
        <Switch
          onCheckedChange={(checked) => setValue('api_access_enabled', checked)}
          defaultChecked={tenant.api_access_enabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>White Label</Label>
          <p className="text-sm text-gray-600">Hide FlowIQ branding</p>
        </div>
        <Switch
          onCheckedChange={(checked) => setValue('white_label_enabled', checked)}
          defaultChecked={tenant.white_label_enabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Label>Active Status</Label>
          <p className="text-sm text-gray-600">Tenant active/inactive status</p>
        </div>
        <Switch
          onCheckedChange={(checked) => setValue('is_active', checked)}
          defaultChecked={tenant.is_active}
        />
      </div>
    </div>
  );
};
