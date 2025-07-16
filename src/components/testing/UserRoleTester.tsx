import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Building2, UserCheck, Settings, Shield, Stethoscope } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSpecialty } from '@/contexts/SpecialtyContext';

interface Tenant {
  id: string;
  name: string;
  specialty: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const tenants: Tenant[] = [
  {
    id: 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
    name: 'Midwest Dental Sleep Medicine Institute',
    specialty: 'dental-sleep-medicine'
  },
  {
    id: '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
    name: 'West County Spine and Joint',
    specialty: 'chiropractic-care'
  }
];

const roles: Role[] = [
  {
    id: 'platform_admin',
    name: 'Platform Admin',
    description: 'Full access to all platform features and tenants',
    icon: <Shield className="h-4 w-4" />,
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'practice_admin',
    name: 'Practice Admin',
    description: 'Admin access to specific practice/tenant',
    icon: <Settings className="h-4 w-4" />,
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'practice_manager',
    name: 'Practice Manager',
    description: 'Management access to practice operations',
    icon: <Building2 className="h-4 w-4" />,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'provider',
    name: 'Provider',
    description: 'Medical provider with clinical access',
    icon: <Stethoscope className="h-4 w-4" />,
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'General staff member with limited access',
    icon: <UserCheck className="h-4 w-4" />,
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    id: 'patient',
    name: 'Patient',
    description: 'Patient with personal data access only',
    icon: <User className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-700'
  }
];

export const UserRoleTester: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<string>(tenants[0].id);
  const [selectedRole, setSelectedRole] = useState<string>('platform_admin');
  const [isApplying, setIsApplying] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const { toast } = useToast();
  const { getBrandName, specialty } = useSpecialty();

  const currentTenant = tenants.find(t => t.id === selectedTenant);
  const currentRole = roles.find(r => r.id === selectedRole);

  const applyTestConfiguration = async () => {
    if (!currentTenant || !currentRole) return;

    setIsApplying(true);
    try {
      // Update user profile with new role and tenant
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: selectedRole as any,
          current_tenant_id: selectedTenant,
          specialty: currentTenant.specialty === 'chiropractic-care' 
            ? 'Chiropractic Care' 
            : 'Dental Sleep Medicine'
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      // Update localStorage for immediate specialty detection
      localStorage.setItem('currentSpecialty', currentTenant.specialty);

      toast({
        title: 'Test Configuration Applied',
        description: `Now testing as ${currentRole.name} in ${currentTenant.name}`,
      });

      // Refresh the page to see changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error applying test configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to apply test configuration',
        variant: 'destructive'
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          User Role & Tenant Testing Interface
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Switch between different user roles and tenants to test the complete user experience
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Current Brand</Label>
            <p className="font-medium">{getBrandName()}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Current Specialty</Label>
            <p className="font-medium">{specialty}</p>
          </div>
          <div>
            <Label className="text-xs font-medium text-muted-foreground">Test Mode</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Switch
                id="test-mode"
                checked={testMode}
                onCheckedChange={setTestMode}
              />
              <Label htmlFor="test-mode" className="text-sm">
                {testMode ? 'ON' : 'OFF'}
              </Label>
            </div>
          </div>
        </div>

        {testMode && (
          <>
            {/* Tenant Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Tenant/Practice</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tenants.map((tenant) => (
                  <Card 
                    key={tenant.id}
                    className={`cursor-pointer transition-all ${
                      selectedTenant === tenant.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTenant(tenant.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-sm">{tenant.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {tenant.specialty === 'chiropractic-care' ? 'Chiropractic Care' : 'Dental Sleep Medicine'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tenant.specialty === 'chiropractic-care' ? 'Chiro' : 'Dental'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select User Role</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <Card 
                    key={role.id}
                    className={`cursor-pointer transition-all ${
                      selectedRole === role.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {role.icon}
                            <span className="font-medium text-sm">{role.name}</span>
                          </div>
                          <Badge className={`text-xs ${role.color}`}>
                            {role.id}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Apply Configuration */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">
                  Ready to test as {currentRole?.name} in {currentTenant?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This will update your current session and reload the page
                </p>
              </div>
              <Button 
                onClick={applyTestConfiguration}
                disabled={isApplying}
                className="w-full sm:w-auto"
              >
                {isApplying ? 'Applying...' : 'Apply Test Configuration'}
              </Button>
            </div>
          </>
        )}

        {/* Quick Links for Testing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard">Dashboard</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/patients">Patients</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/appointments">Appointments</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/agents/scribe-iq">Scribe IQ</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};