import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  Calendar,
  Clock,
  Save,
  X
} from 'lucide-react';

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  specialty?: string;
  license_number?: string;
  npi_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProviderFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialty: string;
  license_number: string;
  npi_number: string;
  is_active: boolean;
}

export const ProviderManagement = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProviderFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialty: '',
    license_number: '',
    npi_number: '',
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('first_name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProviderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.specialty) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingProvider) {
        // Update existing provider
        const { error } = await supabase
          .from('providers')
          .update(formData)
          .eq('id', editingProvider.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Provider updated successfully",
        });
      } else {
        // Create new provider
        const { error } = await supabase
          .from('providers')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Provider created successfully",
        });
      }

      resetForm();
      fetchProviders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save provider",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      first_name: provider.first_name,
      last_name: provider.last_name,
      email: provider.email || '',
      phone: provider.phone || '',
      specialty: provider.specialty || '',
      license_number: provider.license_number || '',
      npi_number: provider.npi_number || '',
      is_active: provider.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;

    try {
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('id', providerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider deleted successfully",
      });

      fetchProviders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete provider",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      specialty: '',
      license_number: '',
      npi_number: '',
      is_active: true
    });
    setEditingProvider(null);
    setShowForm(false);
  };

  const specialties = [
    'Chiropractor',
    'Physical Therapist',
    'Massage Therapist',
    'Acupuncturist',
    'Sports Medicine',
    'Orthopedic Specialist',
    'Pain Management',
    'General Practice'
  ];

  if (showForm) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {editingProvider ? 'Edit Provider' : 'Add New Provider'}
          </CardTitle>
          <CardDescription>
            {editingProvider ? 'Update provider information' : 'Add a new healthcare provider to your practice'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  placeholder="Dr. John"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  placeholder="Smith"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="doctor@practice.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => handleInputChange('license_number', e.target.value)}
                  placeholder="State license number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="npi_number">NPI Number</Label>
                <Input
                  id="npi_number"
                  value={formData.npi_number}
                  onChange={(e) => handleInputChange('npi_number', e.target.value)}
                  placeholder="National Provider Identifier"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active Provider</Label>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : (editingProvider ? 'Update Provider' : 'Add Provider')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Provider Management</CardTitle>
                <CardDescription>
                  Manage healthcare providers and their information
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading && providers.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading providers...</p>
        </div>
      ) : providers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Providers Found</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first healthcare provider
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Provider
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {provider.first_name} {provider.last_name}
                        </h3>
                        <Badge variant={provider.is_active ? "default" : "secondary"}>
                          {provider.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-primary">{provider.specialty}</span>
                        
                        {provider.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{provider.phone}</span>
                          </div>
                        )}
                        
                        {provider.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{provider.email}</span>
                          </div>
                        )}
                      </div>
                      
                      {(provider.license_number || provider.npi_number) && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {provider.license_number && (
                            <span>License: {provider.license_number}</span>
                          )}
                          {provider.npi_number && (
                            <span>NPI: {provider.npi_number}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(provider)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(provider.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};