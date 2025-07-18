
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  CheckCircle,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  LogIn,
  Play,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentTenant } from "@/utils/enhancedTenantConfig";

const Index = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { currentTenant, loading: tenantLoading } = useCurrentTenant();

  const handleGetStarted = () => {
    console.log("Get Started clicked", { user, profile });
    if (user) {
      // Redirect authenticated users to their appropriate dashboard or onboarding
      if (profile?.role === 'patient') {
        console.log("Navigating to patient dashboard");
        navigate('/patient-dashboard');
      } else if (['practice_admin', 'platform_admin'].includes(profile?.role) && !currentTenant) {
        // New admin users without tenant - start onboarding
        console.log("Navigating to onboarding");
        navigate('/onboarding');
      } else {
        console.log("Navigating to specialty selection");
        navigate('/dashboard'); // This will show specialty selection
      }
    } else {
      console.log("Navigating to auth page for signup");
      navigate('/auth?defaultTab=signup');
    }
  };

  const handleViewDemo = () => {
    console.log("View Demo clicked");
    navigate('/demo');
  };

  const handleSignIn = () => {
    console.log("Sign In clicked");
    navigate('/auth?defaultTab=signin');
  };

  // Show loading state while checking auth or tenant
  if (loading || tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Debug: Log current state
  console.log("Index page rendering:", { user: !!user, profile, currentTenant, loading, tenantLoading });

  const features = [
    {
      title: "Smart Scheduling",
      description: "AI-powered appointment scheduling with automated reminders",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Patient Management",
      description: "Comprehensive patient records and intake automation",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Real-time Analytics",
      description: "Practice insights and performance metrics dashboard",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Revenue Optimization",
      description: "Claims processing and billing workflow automation",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "AI Assistant",
      description: "Intelligent automation for documentation and workflows",
      icon: Brain,
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and compliance monitoring",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">
                  FlowIQ
                </h1>
                <p className="text-xl text-primary font-medium">
                  The AI Business Operating System
                </p>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Practice Management, 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-accent">
                  {" "}Reimagined
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your practice with AI-powered automation, intelligent workflows, 
                and comprehensive analytics. Reduce administrative burden while improving patient care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button 
                  size="lg" 
                  className="gradient-primary text-primary-foreground hover:scale-105 transition-all duration-200 px-8 py-3 text-lg shadow-lg"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary-muted"
                  onClick={handleViewDemo}
                >
                  <Play className="mr-2 w-5 h-5" />
                  View Demo
                </Button>
                
                {user ? (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-3 text-lg"
                    onClick={handleGetStarted}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="px-8 py-3 text-lg"
                    onClick={handleSignIn}
                  >
                    <LogIn className="mr-2 w-5 h-5" />
                    Sign In
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  No Setup Fees
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                  30-Day Free Trial
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Practice
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed specifically for healthcare professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-primary py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals who trust FlowIQ
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-50 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleGetStarted}
          >
            {user ? 'Access Dashboard' : 'Start Free Trial'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FlowIQ</span>
            </div>
            <p className="text-gray-400 mb-6">
              The AI Business Operating System
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 FlowIQ. All rights reserved.</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
