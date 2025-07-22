
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestUser {
  email: string;
  role: string;
  name: string;
}

interface CreateUserResult {
  success: boolean;
  email: string;
  error?: string;
}

interface CreateUsersResponse {
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
  results: CreateUserResult[];
}

const testUsers: TestUser[] = [
  { email: 'admin@flowiq.test', role: 'platform_admin', name: 'Platform Admin' },
  { email: 'practice.admin@flowiq.test', role: 'practice_admin', name: 'Practice Admin' },
  { email: 'dr.smith@flowiq.test', role: 'provider', name: 'Dr. John Smith' },
  { email: 'dr.johnson@flowiq.test', role: 'provider', name: 'Dr. Sarah Johnson' },
  { email: 'staff.mary@flowiq.test', role: 'staff', name: 'Mary Williams' },
  { email: 'staff.bob@flowiq.test', role: 'staff', name: 'Bob Davis' },
  { email: 'patient.jane@flowiq.test', role: 'patient', name: 'Jane Doe' },
  { email: 'patient.mike@flowiq.test', role: 'patient', name: 'Mike Brown' },
  { email: 'patient.lisa@flowiq.test', role: 'patient', name: 'Lisa Wilson' },
  { email: 'billing@flowiq.test', role: 'billing', name: 'Emily Thompson' }
];

export const TestUserManager: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState<CreateUsersResponse | null>(null);
  const { toast } = useToast();

  const createTestUsers = async () => {
    setIsCreating(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('seed-test-users');
      
      if (error) {
        throw error;
      }

      setResults(data as CreateUsersResponse);
      toast({
        title: "Success",
        description: `Created ${data.summary.successful} test users successfully!`,
      });

    } catch (error: unknown) {
      console.error('Error creating test users:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create test users";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyCredentials = (email: string) => {
    const credentials = `Email: ${email}\nPassword: TestPassword123!`;
    navigator.clipboard.writeText(credentials);
    toast({
      title: "Copied",
      description: "Credentials copied to clipboard",
    });
  };

  const getRoleBadgeVariant = (role: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (role) {
      case 'platform_admin': return 'destructive';
      case 'practice_admin': return 'default';
      case 'provider': return 'secondary';
      case 'staff': return 'outline';
      case 'patient': return 'secondary';
      case 'billing': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Test User Management
          </CardTitle>
          <CardDescription>
            Create test users for different roles to test the application functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This will create test users with the password: <code className="bg-gray-100 px-1 rounded">TestPassword123!</code>
              <br />
              All test emails use the domain: <code className="bg-gray-100 px-1 rounded">@flowiq.test</code>
            </AlertDescription>
          </Alert>

          <Button 
            onClick={createTestUsers} 
            disabled={isCreating}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Test Users...
              </>
            ) : (
              <>
                <Users className="w-4 h-4 mr-2" />
                Create All Test Users
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test User List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Test Users</CardTitle>
          <CardDescription>
            Pre-configured test accounts for different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {testUsers.map((user) => (
              <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCredentials(user.email)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Credentials
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Creation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully created {results.summary.successful} out of {results.summary.total} test users
                {results.summary.failed > 0 && ` (${results.summary.failed} failed)`}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              {results.results.map((result, index) => (
                <div key={index} className={`flex items-center justify-between p-2 rounded ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <span className="text-sm">{result.email}</span>
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'Created' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
