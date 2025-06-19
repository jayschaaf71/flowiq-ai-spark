
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Calendar, 
  Clock, 
  Shield, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Settings,
  Activity,
  Play,
  Users,
  BarChart3,
  Zap
} from "lucide-react";
import { useTenantConfig } from "@/utils/tenantConfig";

export const PatientLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantConfig = useTenantConfig();

  const quickActions = [
    {
      icon: Calendar,
      title: "Schedule Appointment",
      description: "Book your next visit",
      action: () => navigate(user ? "/book-appointment" : "/patient-auth"),
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    {
      icon: Clock,
      title: "View Appointments",
      description: "Check upcoming visits",
      action: () => navigate("/patient-dashboard"),
      color: "bg-green-50 text-green-600 hover:bg-green-100"
    },
    {
      icon: Settings,
      title: "Update Profile",
      description: "Manage your information",
      action: () => navigate("/settings"),
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Scheduling",
      description: `Smart appointment booking for ${tenantConfig.specialty.toLowerCase()}`
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA compliant patient data protection"
    },
    {
      icon: Activity,
      title: "Real-Time Updates",
      description: "Instant notifications and appointment confirmations"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your health journey and treatment progress"
    }
  ];

  const getServices = () => {
    if (tenantConfig.name === 'ChiroIQ') {
      return [
        "Chiropractic Adjustments",
        "Spinal Decompression Therapy", 
        "Physical Rehabilitation",
        "Sports Injury Treatment"
      ];
    } else if (tenantConfig.name === 'DentalIQ') {
      return [
        "Regular Cleanings",
        "Comprehensive Exams",
        "Fillings & Restorations",
        "Root Canal Therapy"
      ];
    }
    return [
      "Comprehensive Care",
      "Expert Consultations",
      "Treatment Planning",
      "Follow-up Care"
    ];
  };

  const services = getServices();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-xl font-bold text-gray-900">{tenantConfig.brandName}</span>
                <p className="text-sm text-gray-500">{tenantConfig.specialty}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <Button 
                  onClick={() => navigate("/admin")}
                  className={`bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700 text-white`}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/patient-auth")}
                    className="text-gray-600 border-gray-300"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate("/patient-auth")}
                    className={`bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700 text-white`}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {tenantConfig.brandName}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your intelligent {tenantConfig.specialty.toLowerCase()} management platform. 
            Schedule appointments, manage your health records, and stay connected with your care team.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md" onClick={action.action}>
              <CardHeader className="text-center pb-4">
                <div className={`h-12 w-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose {tenantConfig.brandName}?
            </h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`bg-${tenantConfig.primaryColor}-50 p-3 rounded-lg`}>
                    <feature.icon className={`h-6 w-6 text-${tenantConfig.primaryColor}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className={`p-8 bg-gradient-to-br from-${tenantConfig.primaryColor}-50 to-${tenantConfig.secondaryColor}-50 border-0 shadow-lg`}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-gray-900">Our Services</CardTitle>
              <CardDescription className="text-gray-600">
                Comprehensive {tenantConfig.specialty.toLowerCase()} care tailored to your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
              
              <div className="pt-6">
                <Button 
                  className={`w-full bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700 text-white`}
                  size="lg"
                  onClick={() => navigate(user ? "/book-appointment" : "/patient-auth")}
                >
                  {user ? "Book Appointment" : "Get Started Today"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className={`text-3xl font-bold text-${tenantConfig.primaryColor}-600 mb-2`}>500+</div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Online Booking</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-bold text-gray-900">{tenantConfig.brandName}</span>
              </div>
              <p className="text-gray-600">
                Advanced {tenantConfig.specialty.toLowerCase()} management powered by AI technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(555) 400-0002</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@flow-iq.ai</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Innovation District</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className={`block text-gray-600 hover:text-${tenantConfig.primaryColor}-600 transition-colors`}>About Us</a>
                <a href="#" className={`block text-gray-600 hover:text-${tenantConfig.primaryColor}-600 transition-colors`}>Services</a>
                <a href="#" className={`block text-gray-600 hover:text-${tenantConfig.primaryColor}-600 transition-colors`}>Contact</a>
                <a href="#" className={`block text-gray-600 hover:text-${tenantConfig.primaryColor}-600 transition-colors`}>Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500">
            © 2024 {tenantConfig.brandName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientLanding;
