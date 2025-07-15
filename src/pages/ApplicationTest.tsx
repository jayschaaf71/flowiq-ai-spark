import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useTenantConfig } from '@/utils/enhancedTenantConfig';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Stethoscope, 
  Brain,
  Activity,
  Monitor,
  Settings,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Rocket,
  GraduationCap,
  Handshake,
  Package,
  HelpCircle
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  details?: string;
}

const ApplicationTest = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const tenantConfig = useTenantConfig();
  const { specialty, getBrandName } = useSpecialty();
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Define all routes to test
  const dentalSleepRoutes = [
    { path: '/dental-sleep/dashboard', name: 'Dashboard', icon: Monitor },
    { path: '/dental-sleep/sleep-studies', name: 'Sleep Studies', icon: Brain },
    { path: '/dental-sleep/dme-tracker', name: 'DME Tracker', icon: Package },
    { path: '/dental-sleep/ehr', name: 'EHR', icon: FileText },
    { path: '/dental-sleep/schedule', name: 'Schedule', icon: Calendar },
    { path: '/dental-sleep/patient-management', name: 'Patients', icon: Users },
    { path: '/dental-sleep/agents/appointment', name: 'Appointment iQ', icon: Calendar },
    { path: '/dental-sleep/agents/intake', name: 'Intake iQ', icon: FileText },
    { path: '/dental-sleep/agents/scribe', name: 'Scribe iQ', icon: Stethoscope },
    { path: '/dental-sleep/agents/claims', name: 'Claims iQ', icon: DollarSign },
    { path: '/dental-sleep/agents/payments', name: 'Payments iQ', icon: DollarSign },
    { path: '/dental-sleep/agents/education', name: 'Education iQ', icon: GraduationCap },
    { path: '/dental-sleep/agents/marketing', name: 'Marketing iQ', icon: Rocket },
    { path: '/dental-sleep/agents/referral', name: 'Referral iQ', icon: Handshake },
    { path: '/dental-sleep/agents/auth', name: 'Auth iQ', icon: Settings },
    { path: '/dental-sleep/settings', name: 'Settings', icon: Settings },
    { path: '/dental-sleep/help', name: 'Help', icon: HelpCircle }
  ];

  const chiropracticRoutes = [
    { path: '/chiropractic/dashboard', name: 'Dashboard', icon: Monitor },
    { path: '/chiropractic/schedule', name: 'Schedule', icon: Calendar },
    { path: '/chiropractic/analytics', name: 'Analytics', icon: Activity },
    { path: '/chiropractic/ehr', name: 'EHR', icon: FileText },
    { path: '/chiropractic/patient-management', name: 'Patients', icon: Users },
    { path: '/chiropractic/financial', name: 'Financial', icon: DollarSign },
    { path: '/chiropractic/patient-experience', name: 'Patient Experience', icon: Users },
    { path: '/chiropractic/ai-automation', name: 'AI Automation', icon: Brain },
    { path: '/chiropractic/agents/appointment', name: 'Appointment iQ', icon: Calendar },
    { path: '/chiropractic/agents/intake', name: 'Intake iQ', icon: FileText },
    { path: '/chiropractic/agents/scribe', name: 'Scribe iQ', icon: Stethoscope },
    { path: '/chiropractic/agents/claims', name: 'Claims iQ', icon: DollarSign },
    { path: '/chiropractic/agents/payments', name: 'Payments iQ', icon: DollarSign },
    { path: '/chiropractic/agents/inventory', name: 'Inventory iQ', icon: Package },
    { path: '/chiropractic/agents/insights', name: 'Insight iQ', icon: Activity },
    { path: '/chiropractic/agents/education', name: 'Education iQ', icon: GraduationCap },
    { path: '/chiropractic/agents/marketing', name: 'Marketing iQ', icon: Rocket },
    { path: '/chiropractic/agents/referral', name: 'Referral iQ', icon: Handshake },
    { path: '/chiropractic/agents/auth', name: 'Auth iQ', icon: Settings },
    { path: '/chiropractic/agents/ops', name: 'Ops iQ', icon: Settings },
    { path: '/chiropractic/settings', name: 'Settings', icon: Settings },
    { path: '/chiropractic/help', name: 'Help', icon: HelpCircle }
  ];

  const runTests = () => {
    const results: TestResult[] = [];

    // Test authentication
    results.push({
      name: 'Authentication',
      status: user ? 'pass' : 'fail',
      description: 'User authentication status',
      details: user ? `Logged in as ${user.email}` : 'No user logged in'
    });

    // Test profile
    results.push({
      name: 'User Profile',
      status: profile ? 'pass' : 'fail',
      description: 'User profile data',
      details: profile ? `Role: ${profile.role}` : 'No profile data'
    });

    // Test tenant configuration
    results.push({
      name: 'Tenant Configuration',
      status: tenantConfig?.tenantConfig ? 'pass' : 'fail',
      description: 'Tenant configuration loaded',
      details: tenantConfig?.tenantConfig ? `${tenantConfig.tenantConfig.brand_name} (${tenantConfig.tenantConfig.specialty})` : 'No tenant config'
    });

    // Test specialty context
    results.push({
      name: 'Specialty Context',
      status: specialty ? 'pass' : 'warning',
      description: 'Specialty context provider',
      details: specialty ? `Current specialty: ${specialty}` : 'No specialty detected'
    });

    // Test branding
    results.push({
      name: 'Brand Name',
      status: getBrandName() ? 'pass' : 'warning',
      description: 'Brand name resolution',
      details: getBrandName() || 'No brand name'
    });

    setTestResults(results);
  };

  const testRoute = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error(`Failed to navigate to ${path}:`, error);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const currentSpecialty = tenantConfig?.tenantConfig?.specialty || 'unknown';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application Testing Suite</h1>
          <p className="text-muted-foreground">Comprehensive testing for both Dental Sleep and Chiropractic applications</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Current: {currentSpecialty === 'dental-sleep-medicine' ? 'Dental Sleep' : 'Chiropractic'}
        </Badge>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>System Tests</CardTitle>
          <CardDescription>Core system functionality verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button onClick={runTests}>Run System Tests</Button>
          </div>
          
          {testResults.length > 0 && (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </div>
                  {result.details && (
                    <Badge variant="outline" className="text-xs">
                      {result.details}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Route Testing */}
      <Tabs defaultValue="dental-sleep" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dental-sleep">Dental Sleep Medicine Routes</TabsTrigger>
          <TabsTrigger value="chiropractic">Chiropractic Routes</TabsTrigger>
        </TabsList>

        <TabsContent value="dental-sleep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Midwest Dental Sleep Medicine Institute</CardTitle>
              <CardDescription>Test all dental sleep medicine application routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dentalSleepRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Button
                      key={route.path}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => testRoute(route.path)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm text-center">{route.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chiropractic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>West County Spine and Joint</CardTitle>
              <CardDescription>Test all chiropractic application routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chiropracticRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Button
                      key={route.path}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => testRoute(route.path)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm text-center">{route.name}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">User</p>
              <p className="text-muted-foreground">{user?.email || 'Not logged in'}</p>
            </div>
            <div>
              <p className="font-medium">Role</p>
              <p className="text-muted-foreground">{profile?.role || 'Unknown'}</p>
            </div>
            <div>
              <p className="font-medium">Tenant</p>
              <p className="text-muted-foreground">{tenantConfig?.tenantConfig?.brand_name || 'Unknown'}</p>
            </div>
            <div>
              <p className="font-medium">Specialty</p>
              <p className="text-muted-foreground">{tenantConfig?.tenantConfig?.specialty || 'Unknown'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTest;