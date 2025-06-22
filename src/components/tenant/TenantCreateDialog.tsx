import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';

interface TenantFormData {
  name: string;
  slug: string;
  brand_name: string;
  tagline: string;
  specialty: string;
  subscription_tier: string;
  primary_color: string;
  secondary_color: string;
  custom_branding_enabled: boolean;
  api_access_enabled: boolean;
  white_label_enabled: boolean;
  max_forms: number;
  max_submissions: number;
  max_users: number;
}

export const TenantCreateDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    slug: '',
    brand_name: '',
    tagline: '',
    specialty: 'Healthcare',
    subscription_tier: 'basic',
    primary_color: '#3B82F6',
    secondary_color: '#06B6D4',
    custom_branding_enabled: false,
    api_access_enabled: false,
    white_label_enabled: false,
    max_forms: 10,
    max_submissions: 1000,
    max_users: 5
  });

  const { createTenant, isCreating } = useTenantManagement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add the missing is_active property
    const tenantData = {
      ...formData,
      is_active: true
    };
    
    createTenant(tenantData);
    setOpen(false);
    setFormData({
      name: '',
      slug: '',
      brand_name: '',
      tagline: '',
      specialty: 'Healthcare',
      subscription_tier: 'basic',
      primary_color: '#3B82F6',
      secondary_color: '#06B6D4',
      custom_branding_enabled: false,
      api_access_enabled: false,
      white_label_enabled: false,
      max_forms: 10,
      max_submissions: 1000,
      max_users: 5
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Tenant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Set up a new tenant organization with custom branding and configuration.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                placeholder="organization-name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name</Label>
              <Input
                id="brand_name"
                value={formData.brand_name}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Chiropractic Care">Chiropractic Care</SelectItem>
                  <SelectItem value="Dental Care">Dental Care</SelectItem>
                  <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                  <SelectItem value="Mental Health">Mental Health</SelectItem>
                  <SelectItem value="Healthcare">General Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Textarea
              id="tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Brief description of your organization"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subscription_tier">Subscription Tier</Label>
              <Select value={formData.subscription_tier} onValueChange={(value) => setFormData({ ...formData, subscription_tier: value })}>
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
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Features</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="custom_branding"
                  checked={formData.custom_branding_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, custom_branding_enabled: checked })}
                />
                <Label htmlFor="custom_branding">Custom Branding</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="api_access"
                  checked={formData.api_access_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, api_access_enabled: checked })}
                />
                <Label htmlFor="api_access">API Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="white_label"
                  checked={formData.white_label_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, white_label_enabled: checked })}
                />
                <Label htmlFor="white_label">White Label</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Tenant'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
