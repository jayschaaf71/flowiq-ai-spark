
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTenantManagement } from '@/hooks/useTenantManagement';

interface TenantCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TenantFormData {
  name: string;
  slug: string;
  brand_name: string;
  tagline: string;
  specialty: string;
  subscription_tier: string;
  max_forms: number;
  max_submissions: number;
  max_users: number;
  custom_branding_enabled: boolean;
  api_access_enabled: boolean;
  white_label_enabled: boolean;
  domain?: string;
  subdomain?: string;
  primary_color: string;
  secondary_color: string;
}

export const TenantCreateDialog: React.FC<TenantCreateDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { createTenant, isCreating } = useTenantManagement();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<TenantFormData>({
    defaultValues: {
      subscription_tier: 'basic',
      max_forms: 10,
      max_submissions: 1000,
      max_users: 5,
      custom_branding_enabled: false,
      api_access_enabled: false,
      white_label_enabled: false,
      primary_color: '#3B82F6',
      secondary_color: '#06B6D4',
    }
  });

  const selectedTier = watch('subscription_tier');

  const onSubmit = (data: TenantFormData) => {
    createTenant(data);
    reset();
    onOpenChange(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Set up a new tenant with custom branding and configuration
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tenant Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  onChange={(e) => {
                    register('name').onChange(e);
                    setValue('slug', generateSlug(e.target.value));
                  }}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  {...register('slug', { required: 'Slug is required' })}
                />
                {errors.slug && <p className="text-sm text-red-600">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  {...register('brand_name', { required: 'Brand name is required' })}
                />
                {errors.brand_name && <p className="text-sm text-red-600">{errors.brand_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="specialty">Specialty</Label>
                <Select onValueChange={(value) => setValue('specialty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chiropractic Care">Chiropractic Care</SelectItem>
                    <SelectItem value="Dental Care">Dental Care</SelectItem>
                    <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                    <SelectItem value="Mental Health">Mental Health</SelectItem>
                    <SelectItem value="General Healthcare">General Healthcare</SelectItem>
                    <SelectItem value="Veterinary">Veterinary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                {...register('tagline')}
                placeholder="Brief description of the practice"
              />
            </div>
          </div>

          {/* Subscription & Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscription & Limits</h3>
            
            <div>
              <Label htmlFor="subscription_tier">Subscription Tier</Label>
              <Select onValueChange={(value) => setValue('subscription_tier', value)} defaultValue="basic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

          {/* Features & Branding */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features & Branding</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="custom_branding">Custom Branding</Label>
                  <p className="text-sm text-gray-600">Allow custom colors, logos, and styling</p>
                </div>
                <Switch
                  id="custom_branding"
                  onCheckedChange={(checked) => setValue('custom_branding_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="api_access">API Access</Label>
                  <p className="text-sm text-gray-600">Enable API integration capabilities</p>
                </div>
                <Switch
                  id="api_access"
                  onCheckedChange={(checked) => setValue('api_access_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="white_label">White Label</Label>
                  <p className="text-sm text-gray-600">Hide FlowIQ branding completely</p>
                </div>
                <Switch
                  id="white_label"
                  onCheckedChange={(checked) => setValue('white_label_enabled', checked)}
                />
              </div>
            </div>

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
          </div>

          {/* Domain Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Domain Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  {...register('subdomain')}
                  placeholder="tenant.flowiq.ai"
                />
              </div>

              <div>
                <Label htmlFor="domain">Custom Domain</Label>
                <Input
                  id="domain"
                  {...register('domain')}
                  placeholder="practice.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Tenant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
