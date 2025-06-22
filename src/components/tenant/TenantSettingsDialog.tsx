
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenantManagement, Tenant } from '@/hooks/useTenantManagement';
import { TenantGeneralSettings } from './TenantGeneralSettings';
import { TenantLimitsSettings } from './TenantLimitsSettings';
import { TenantFeaturesSettings } from './TenantFeaturesSettings';
import { TenantBrandingSettingsTab } from './TenantBrandingSettingsTab';

interface TenantSettingsDialogProps {
  tenant: Tenant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TenantSettingsDialog: React.FC<TenantSettingsDialogProps> = ({
  tenant,
  open,
  onOpenChange,
}) => {
  const { updateTenant, isUpdating } = useTenantManagement();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: tenant,
  });

  const onSubmit = (data: any) => {
    updateTenant({ id: tenant.id, updates: data });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tenant Settings - {tenant.brand_name}</DialogTitle>
          <DialogDescription>
            Configure tenant-specific settings and features
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="limits">Limits</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TabsContent value="general" className="space-y-4">
              <TenantGeneralSettings register={register} />
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <TenantLimitsSettings register={register} />
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <TenantFeaturesSettings tenant={tenant} setValue={setValue} />
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
              <TenantBrandingSettingsTab register={register} />
            </TabsContent>

            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
