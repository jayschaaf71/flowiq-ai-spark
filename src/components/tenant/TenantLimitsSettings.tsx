
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Tenant } from '@/hooks/useTenantManagement';

interface TenantLimitsSettingsProps {
  register: UseFormRegister<Tenant>;
}

export const TenantLimitsSettings: React.FC<TenantLimitsSettingsProps> = ({
  register
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="max_forms">Max Forms</Label>
          <Input 
            id="max_forms" 
            type="number" 
            {...register('max_forms', { valueAsNumber: true })} 
          />
        </div>
        <div>
          <Label htmlFor="max_submissions">Max Submissions</Label>
          <Input 
            id="max_submissions" 
            type="number" 
            {...register('max_submissions', { valueAsNumber: true })} 
          />
        </div>
        <div>
          <Label htmlFor="max_users">Max Users</Label>
          <Input 
            id="max_users" 
            type="number" 
            {...register('max_users', { valueAsNumber: true })} 
          />
        </div>
      </div>
    </div>
  );
};
