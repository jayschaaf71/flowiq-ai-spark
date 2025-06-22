
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tenant } from '@/hooks/useTenantManagement';

interface TenantGeneralSettingsProps {
  register: UseFormRegister<Tenant>;
}

export const TenantGeneralSettings: React.FC<TenantGeneralSettingsProps> = ({
  register
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tenant Name</Label>
          <Input id="name" {...register('name')} />
        </div>
        <div>
          <Label htmlFor="brand_name">Brand Name</Label>
          <Input id="brand_name" {...register('brand_name')} />
        </div>
      </div>
      
      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" {...register('tagline')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="domain">Custom Domain</Label>
          <Input id="domain" {...register('domain')} />
        </div>
        <div>
          <Label htmlFor="subdomain">Subdomain</Label>
          <Input id="subdomain" {...register('subdomain')} />
        </div>
      </div>
    </div>
  );
};
