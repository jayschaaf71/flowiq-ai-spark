import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SetupLayout } from "@/components/SetupLayout";
import { Loader2, Brain, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultTab, setDefaultTab] = useState("signup");

  // Initialize state first
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle invitation parameters
  useEffect(() => {
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const role = searchParams.get('role');
    const tabParam = searchParams.get('defaultTab');

    console.log('AuthPage URL params:', { email, firstName, lastName, role, tabParam });

    if (email && firstName && lastName) {
      const newSignUpData = {
        email: decodeURIComponent(email),
        firstName: decodeURIComponent(firstName),
        lastName: decodeURIComponent(lastName),
        role: role ? decodeURIComponent(role) : 'patient',
        password: "",
        confirmPassword: ""
      };
      console.log('Setting signUpData to:', newSignUpData);
      setSignUpData(prev => ({
        ...prev,
        ...newSignUpData
      }));
    }

    if (tabParam) {
      setDefaultTab(decodeURIComponent(tabParam));
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(
        signUpData.email,
        signUpData.password,
        signUpData.firstName,
        signUpData.lastName,
        signUpData.role
      );

      if (error) {
        setError(error.message);
      } else {
        // Redirect to practice setup after successful signup
        navigate("/practice-setup");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn(signInData.email, signInData.password);

      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: { email: resetEmail }
      });

      if (error) {
        setError(error.message);
      } else {
        setResetSent(true);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
                <p className="text-sm text-muted-foreground">Practice Management Platform</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Get started with your AI-powered practice management
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Start your free trial with FlowIQ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          value={signUpData.firstName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your FlowIQ account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                    
                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-sm"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Forgot Password Dialog */}
          {showForgotPassword && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail("");
                      setResetSent(false);
                      setError(null);
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                      {resetSent ? "Check your email" : "Enter your email address"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {resetSent ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to <strong>{resetEmail}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click the link in the email to reset your password. 
                      Check your spam folder if you don't see it.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="reset-email">Email Address</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || !resetEmail}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Link
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          <div className="text-center text-sm text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </SetupLayout>
  );
}