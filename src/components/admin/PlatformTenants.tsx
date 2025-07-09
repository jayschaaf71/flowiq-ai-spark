import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Settings, Plus, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  specialty: string;
  practice_type: string;
  is_active: boolean;
  created_at: string;
  owner_id: string;
  user_count?: number;
}

export const PlatformTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading tenants...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage all tenant organizations and their configurations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{tenant.name}</CardTitle>
              <Badge variant={tenant.is_active ? 'default' : 'secondary'}>
                {tenant.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tenant.user_count || 0} users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{tenant.specialty}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>Type: {tenant.practice_type}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>Domain: {tenant.subdomain}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};