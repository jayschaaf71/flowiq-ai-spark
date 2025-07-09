import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Play, Users, Database, Settings, TestTube } from 'lucide-react';
import { useSampleDataGenerator } from '@/hooks/useSampleDataGenerator';
import { useTenantManagement } from '@/hooks/useTenantManagement';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  action?: () => void;
}

export const PilotSetupWizard: React.FC = () => {
  const { loading, generateChiropracticData, generateDentalSleepData } = useSampleDataGenerator();
  const { tenants, createTenant, isCreating } = useTenantManagement();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const createWestCountyTenant = async () => {
    try {
      const westCountyData = {
        name: 'West County Spine and Joint',
        slug: 'west-county-spine',
        brand_name: 'West County Spine & Joint',
        tagline: 'Your Partner in Spinal Health',
        primary_color: '#059669',
        secondary_color: '#10b981',
        specialty: 'chiropractic',
        subscription_tier: 'professional',
        max_forms: 25,
        max_submissions: 500,
        max_users: 8,
        custom_branding_enabled: true,
        api_access_enabled: true,
        white_label_enabled: false,
        is_active: true
      };

      await createTenant(westCountyData);
      markStepCompleted('create-tenants');
    } catch (error) {
      console.error('Error creating West County tenant:', error);
    }
  };

  const handleGenerateSampleData = async () => {
    const westCountyTenant = tenants?.find(t => t.slug === 'west-county-spine');
    const midwestTenant = tenants?.find(t => t.name.includes('Midwest'));

    if (westCountyTenant) {
      await generateChiropracticData(westCountyTenant.id);
    }

    if (midwestTenant) {
      await generateDentalSleepData(midwestTenant.id);
    }

    markStepCompleted('sample-data');
  };

  const steps: SetupStep[] = [
    {
      id: 'create-tenants',
      title: 'Create Pilot Tenants',
      description: 'Set up West County Spine & Joint tenant',
      icon: <Users className="h-5 w-5" />,
      completed: completedSteps.has('create-tenants') || tenants?.some(t => t.slug === 'west-county-spine') || false,
      action: createWestCountyTenant
    },
    {
      id: 'sample-data',
      title: 'Generate Sample Data',
      description: 'Create realistic patient data for both pilot practices',
      icon: <Database className="h-5 w-5" />,
      completed: completedSteps.has('sample-data'),
      action: handleGenerateSampleData
    },
    {
      id: 'configure-settings',
      title: 'Configure Practice Settings',
      description: 'Set up specialty-specific configurations',
      icon: <Settings className="h-5 w-5" />,
      completed: completedSteps.has('configure-settings'),
      action: () => markStepCompleted('configure-settings')
    },
    {
      id: 'test-workflows',
      title: 'Test Key Workflows',
      description: 'Verify patient intake, scheduling, and billing workflows',
      icon: <TestTube className="h-5 w-5" />,
      completed: completedSteps.has('test-workflows'),
      action: () => markStepCompleted('test-workflows')
    }
  ];

  const completedCount = steps.filter(step => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Pilot Setup Wizard
          </CardTitle>
          <CardDescription>
            Prepare both pilot practices for production testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>{completedCount}/{steps.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid gap-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {step.completed ? (
                    <Badge variant="default">Completed</Badge>
                  ) : (
                    step.action && (
                      <Button
                        onClick={step.action}
                        disabled={loading || isCreating}
                        size="sm"
                      >
                        {loading || isCreating ? 'Processing...' : 'Start'}
                      </Button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {completedCount === steps.length && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Pilot setup complete! Both practices are ready for testing.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pilot Practices Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">West County Spine & Joint</CardTitle>
            <CardDescription>Chiropractic Practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Specialty:</span>
                <Badge variant="outline">Chiropractic</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm">Springfield, MO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={tenants?.some(t => t.slug === 'west-county-spine') ? 'default' : 'secondary'}>
                  {tenants?.some(t => t.slug === 'west-county-spine') ? 'Ready' : 'Pending Setup'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Midwest Dental Sleep Medicine</CardTitle>
            <CardDescription>Dental Sleep Medicine Practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Specialty:</span>
                <Badge variant="outline">Dental Sleep</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm">Des Moines, IA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant={tenants?.some(t => t.name.includes('Midwest')) ? 'default' : 'secondary'}>
                  {tenants?.some(t => t.name.includes('Midwest')) ? 'Ready' : 'Pending Setup'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};