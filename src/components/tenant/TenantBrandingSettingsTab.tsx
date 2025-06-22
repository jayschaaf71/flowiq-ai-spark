
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tenant } from '@/hooks/useTenantManagement';

interface TenantBrandingSettingsTabProps {
  register: UseFormRegister<Tenant>;
}

export const TenantBrandingSettingsTab: React.FC<TenantBrandingSettingsTabProps> = ({
  register
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="primary_color">Primary Color</Label>
          <Input
            id="primary_color"
            type="color"
            {...register('primary_color')}
          />
        </div>
        <div>
          <Label htmlFor="secondary_color">Secondary Color</Label>
          <Input
            id="secondary_color"
            type="color"
            {...register('secondary_color')}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input id="logo_url" {...register('logo_url')} />
      </div>
    </div>
  );
};
