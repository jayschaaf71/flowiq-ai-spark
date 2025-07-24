import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Brain, ArrowLeft, Sparkles, Mail, User, Eye, EyeOff } from "lucide-react";
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

  // Redirect if already authenticated - use role-based navigation
  useEffect(() => {
    if (user) {
      console.log("User authenticated, redirecting to dashboard");
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
        // Success! Let the useEffect handle navigation after auth state changes
        console.log("Signup successful, auth state will trigger navigation");
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
        // Let ProtectedRoute handle the redirect based on user role
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

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary/5">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Enhanced Header */}
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <Sparkles className="w-6 h-6 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">FlowIQ</h1>
              <p className="text-xl font-semibold text-primary">The AI Operating System</p>
              <p className="text-muted-foreground text-lg">for Professional Practices</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-foreground">Welcome</CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                Access your AI-powered practice management platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50">
                  <TabsTrigger value="signup" className="text-sm font-medium">Sign Up</TabsTrigger>
                  <TabsTrigger value="signin" className="text-sm font-medium">Sign In</TabsTrigger>
                </TabsList>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                            value={signUpData.firstName}
                            onChange={(e) => setSignUpData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name *</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          className="h-11 border-2 focus:border-primary transition-colors"
                          value={signUpData.lastName}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pr-12 h-11 border-2 focus:border-primary transition-colors"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-muted"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="h-11 border-2 focus:border-primary transition-colors"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 gradient-primary text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] mt-6" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Creating your account...
                        </>
                      ) : (
                        "Start Your FlowIQ Journey"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-medium text-foreground">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 h-12 border-2 focus:border-primary transition-colors"
                          value={signInData.email}
                          onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-sm font-medium text-foreground">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pr-12 h-12 border-2 focus:border-primary transition-colors"
                          value={signInData.password}
                          onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-muted"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 gradient-primary text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Signing you in...
                        </>
                      ) : (
                        "Sign In to FlowIQ"
                      )}
                    </Button>
                    
                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

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

          {/* Professional Footer */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
            <p className="text-xs text-muted-foreground">
              Secure, HIPAA-compliant healthcare technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}