
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { CheckCircle, XCircle, AlertTriangle, Play, User, Shield, Building2 } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  expectedResult: string;
  category: 'auth' | 'routing' | 'tenant' | 'roles';
  status: 'not-run' | 'passed' | 'failed' | 'running';
}

const testCases: TestCase[] = [
  {
    id: 'auth-01',
    name: 'User Registration (Patient)',
    description: 'Test patient registration flow',
    steps: [
      'Navigate to /auth',
      'Click "Sign Up" tab',
      'Fill in: John, Doe, john@test.com, password123, Patient role',
      'Click "Create Secure Account"',
      'Check for success message'
    ],
    expectedResult: 'Success message shown, user redirected to patient dashboard',
    category: 'auth',
    status: 'not-run'
  },
  {
    id: 'auth-02',
    name: 'User Registration (Staff)',
    description: 'Test staff registration flow',
    steps: [
      'Navigate to /auth',
      'Click "Sign Up" tab',
      'Fill in: Jane, Smith, jane@test.com, password123, Healthcare Staff role',
      'Click "Create Secure Account"',
      'Check for success message'
    ],
    expectedResult: 'Success message shown, user redirected to main dashboard',
    category: 'auth',
    status: 'not-run'
  },
  {
    id: 'auth-03',
    name: 'User Sign In',
    description: 'Test existing user sign in',
    steps: [
      'Navigate to /auth',
      'Enter registered email and password',
      'Click "Sign In Securely"',
      'Verify redirect based on role'
    ],
    expectedResult: 'User signed in, redirected to appropriate dashboard',
    category: 'auth',
    status: 'not-run'
  },
  {
    id: 'routing-01',
    name: 'Patient Route Protection',
    description: 'Test that patients cannot access staff areas',
    steps: [
      'Sign in as patient',
      'Try to navigate to /dashboard',
      'Verify redirect to /patient-dashboard'
    ],
    expectedResult: 'Patient redirected to patient dashboard',
    category: 'routing',
    status: 'not-run'
  },
  {
    id: 'routing-02',
    name: 'Staff Route Protection',
    description: 'Test that staff cannot access patient-only areas',
    steps: [
      'Sign in as staff',
      'Try to navigate to /patient-dashboard',
      'Verify redirect to main dashboard'
    ],
    expectedResult: 'Staff redirected to main dashboard',
    category: 'routing',
    status: 'not-run'
  },
  {
    id: 'tenant-01',
    name: 'Tenant Branding Display',
    description: 'Test that tenant branding appears correctly',
    steps: [
      'Visit homepage',
      'Check for FlowIQ branding',
      'Check tagline display',
      'Verify specialty theming'
    ],
    expectedResult: 'Correct branding and theming displayed',
    category: 'tenant',
    status: 'not-run'
  },
  {
    id: 'roles-01',
    name: 'Role-based Dashboard Access',
    description: 'Test different dashboards for different roles',
    steps: [
      'Sign in as patient - should see patient portal',
      'Sign out',
      'Sign in as staff - should see main dashboard'
    ],
    expectedResult: 'Each role sees appropriate dashboard',
    category: 'roles',
    status: 'not-run'
  }
];

export const AuthTestCases: React.FC = () => {
  const [tests, setTests] = useState<TestCase[]>(testCases);
  const { user, profile } = useAuth();
  const { currentTenant } = useCurrentTenant();

  const updateTestStatus = (id: string, status: TestCase['status']) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, status } : test
    ));
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <Play className="w-4 h-4 text-blue-600 animate-pulse" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestCase['status']) => {
    const variants = {
      'not-run': 'outline',
      'passed': 'default',
      'failed': 'destructive',
      'running': 'secondary'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const getCategoryIcon = (category: TestCase['category']) => {
    switch (category) {
      case 'auth':
        return <User className="w-4 h-4" />;
      case 'routing':
        return <Shield className="w-4 h-4" />;
      case 'tenant':
        return <Building2 className="w-4 h-4" />;
      case 'roles':
        return <Shield className="w-4 h-4" />;
    }
  };

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, TestCase[]>);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication System Test Suite</h1>
        <p className="text-gray-600">Systematic testing of authentication, routing, and tenant features</p>
      </div>

      {/* Current System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Current System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Authentication</h3>
              <p className="text-sm text-blue-700">
                {user ? `Signed in as: ${profile?.first_name} ${profile?.last_name}` : 'Not signed in'}
              </p>
              <p className="text-xs text-blue-600">
                Role: {profile?.role || 'None'}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Tenant</h3>
              <p className="text-sm text-green-700">
                {currentTenant?.brand_name || 'Default'}
              </p>
              <p className="text-xs text-green-600">
                Specialty: {currentTenant?.specialty || 'None'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-purple-900">Route</h3>
              <p className="text-sm text-purple-700">
                Current: {window.location.pathname}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases by Category */}
      {Object.entries(groupedTests).map(([category, categoryTests]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getCategoryIcon(category as TestCase['category'])}
              {category} Tests
            </CardTitle>
            <CardDescription>
              {category === 'auth' && 'Test user registration, sign in, and sign out flows'}
              {category === 'routing' && 'Test route protection and role-based redirects'}
              {category === 'tenant' && 'Test tenant branding and theming'}
              {category === 'roles' && 'Test role-based access control'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryTests.map((test) => (
                <Card key={test.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        {test.name}
                        {getStatusBadge(test.status)}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTestStatus(test.id, 'running')}
                          disabled={test.status === 'running'}
                        >
                          Start Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTestStatus(test.id, 'passed')}
                          className="text-green-600 border-green-600"
                        >
                          Pass
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTestStatus(test.id, 'failed')}
                          className="text-red-600 border-red-600"
                        >
                          Fail
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Test Steps:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          {test.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Expected Result:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {test.expectedResult}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Testing Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Testing Guidelines:</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• Test in incognito/private browsing mode to avoid cached sessions</li>
            <li>• Clear browser storage between tests if needed</li>
            <li>• Check console for any errors during testing</li>
            <li>• Verify that redirects happen automatically</li>
            <li>• Test both successful and error scenarios</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
