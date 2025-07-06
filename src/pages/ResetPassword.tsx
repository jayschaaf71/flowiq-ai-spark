import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SetupLayout } from '@/components/SetupLayout';
import { Loader2, Brain, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });

  // Check if we have a valid reset session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsValidSession(true);
      } else {
        setError('Invalid or expired password reset link. Please request a new one.');
      }
    };
    
    checkSession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (passwords.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SetupLayout>
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-green-900">Password Updated!</CardTitle>
              <CardDescription>
                Your password has been successfully updated. You'll be redirected to your dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SetupLayout>
    );
  }

  return (
    <SetupLayout>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FlowIQ</h1>
                <p className="text-sm text-muted-foreground">Reset Your Password</p>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isValidSession ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={passwords.password}
                      onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={6}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    This password reset link is invalid or has expired.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/auth')}
                  >
                    Go to Sign In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SetupLayout>
  );
}