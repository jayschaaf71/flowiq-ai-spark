
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTenantManagement, Tenant } from '@/hooks/useTenantManagement';

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
  const { register, handleSubmit, setValue, watch } = useForm({
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
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="branding" className="space-y-4">
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
