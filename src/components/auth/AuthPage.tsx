import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('🔐 [AUTH] Attempting login with:', { email, password });
    
    try {
      const result = await signIn(email, password);
      console.log('🔐 [AUTH] Sign in result:', result);
      
      if (result.error) {
        console.error('🔐 [AUTH] Sign in error:', result.error);
        // Show error to user
        alert(`Login failed: ${result.error.message || 'Unknown error'}`);
      } else {
        console.log('🔐 [AUTH] Sign in successful');
      }
    } catch (error) {
      console.error('🔐 [AUTH] Unexpected error:', error);
      alert(`Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Test credentials for pilot domains
  const isPilotDomain = window.location.hostname.includes('flow-iq.ai');
  const isAdminDomain = window.location.hostname === 'app.flow-iq.ai';
  
  const testCredentials = isPilotDomain ? {
    email: isAdminDomain ? 'jayschaaf71@gmail.com' : 'admin@flowiq.ai',
    password: isAdminDomain ? 'YourPasswordHere' : 'test123'
  } : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
              <Sparkles className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">FlowIQ</CardTitle>
          <CardDescription>The AI Operating System for Professional Practices</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In to FlowIQ'}
            </Button>
            
            {testCredentials && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">🧪 Test Credentials:</p>
                <p className="text-xs text-blue-600">
                  Email: <code className="bg-blue-100 px-1 rounded">{testCredentials.email}</code><br/>
                  Password: <code className="bg-blue-100 px-1 rounded">{testCredentials.password}</code>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => {
                    setEmail(testCredentials.email);
                    setPassword(testCredentials.password);
                  }}
                >
                  Use Test Credentials
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Secure, HIPAA-compliant healthcare technology
          </p>
        </div>
      </Card>
    </div>
  );
};