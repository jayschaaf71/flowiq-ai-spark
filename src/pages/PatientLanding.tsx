
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
  Brain,
  Activity
} from "lucide-react";
import { useTenantConfig } from "@/utils/tenantConfig";

export const PatientLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantConfig = useTenantConfig();

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: `Book ${tenantConfig.specialty.toLowerCase()} appointments 24/7 with real-time availability`
    },
    {
      icon: Clock,
      title: "Flexible Hours", 
      description: "Morning, afternoon, and evening appointments available"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health information is secure and protected"
    },
    {
      icon: Activity,
      title: "Expert Care",
      description: `Experienced professionals dedicated to your ${tenantConfig.specialty.toLowerCase()}`
    }
  ];

  const getServices = () => {
    if (tenantConfig.name === 'ChiroIQ') {
      return [
        "Chiropractic Adjustments",
        "Spinal Decompression Therapy", 
        "Physical Rehabilitation",
        "Sports Injury Treatment",
        "Auto Accident Recovery",
        "Chronic Pain Management",
        "Wellness & Prevention Care",
        "Custom Treatment Plans"
      ];
    } else if (tenantConfig.name === 'DentalIQ') {
      return [
        "Regular Cleanings",
        "Comprehensive Exams",
        "Fillings & Restorations",
        "Root Canal Therapy",
        "Crown & Bridge Work",
        "Teeth Whitening",
        "Oral Surgery",
        "Preventive Care"
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
    <div className="min-h-screen bg-white">
      {/* Quick Admin Access */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/admin")}
          className="bg-white/90 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Admin Dashboard
        </Button>
      </div>

      {/* Hero Section */}
      <section className={`bg-gradient-to-br from-${tenantConfig.primaryColor}-50 to-${tenantConfig.secondaryColor}-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Brain className={`h-16 w-16 text-${tenantConfig.primaryColor}-600`} />
                <Activity className={`h-8 w-8 text-${tenantConfig.secondaryColor}-600 absolute -top-2 -right-2`} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className={`text-${tenantConfig.primaryColor}-600`}>{tenantConfig.brandName}</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-2 font-semibold">
              AI-Powered {tenantConfig.specialty} Management
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the future of {tenantConfig.specialty.toLowerCase()} with our AI-powered platform. 
              Streamlined scheduling, intelligent intake forms, and seamless patient management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  className={`text-lg px-8 py-4 bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                  onClick={() => navigate("/patient-dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className={`text-lg px-8 py-4 bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                    onClick={() => navigate("/patient-auth")}
                  >
                    Book Appointment
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className={`text-lg px-8 py-4 border-${tenantConfig.primaryColor}-600 text-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-50`}
                    onClick={() => navigate("/patient-auth")}
                  >
                    Patient Portal
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose {tenantConfig.brandName}?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered {tenantConfig.specialty.toLowerCase()} management with intelligent automation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-12 w-12 text-${tenantConfig.primaryColor}-600 mx-auto mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comprehensive {tenantConfig.specialty} Services
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered platform provides intelligent management for all aspects of 
                {tenantConfig.specialty.toLowerCase()}, helping you achieve optimal health outcomes 
                with streamlined, efficient care.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className={`h-5 w-5 text-${tenantConfig.primaryColor}-600 flex-shrink-0`} />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className={`p-8 bg-gradient-to-br from-${tenantConfig.primaryColor}-50 to-${tenantConfig.secondaryColor}-50 border-${tenantConfig.primaryColor}-200`}>
              <CardHeader className="text-center pb-6">
                <CardTitle className={`text-2xl text-${tenantConfig.primaryColor}-700`}>Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Experience AI-powered {tenantConfig.specialty.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600 bg-white/70 p-4 rounded-lg">
                    ✓ AI-powered scheduling recommendations<br/>
                    ✓ Intelligent intake form processing<br/>
                    ✓ Automated workflow management<br/>
                    ✓ Real-time availability updates
                  </div>
                  
                  {user ? (
                    <Button 
                      className={`w-full bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                      size="lg"
                      onClick={() => navigate("/book-appointment")}
                    >
                      Book Appointment Now
                      <Calendar className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                      size="lg"
                      onClick={() => navigate("/patient-auth")}
                    >
                      Get Started Today
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-20 bg-${tenantConfig.primaryColor}-600 text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact {tenantConfig.brandName}
            </h2>
            <p className={`text-xl text-${tenantConfig.primaryColor}-100 max-w-2xl mx-auto`}>
              Have questions about our AI-powered {tenantConfig.specialty.toLowerCase()} platform? 
              We're here to help you transform your healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className={`h-12 w-12 mx-auto mb-4 text-${tenantConfig.primaryColor}-200`} />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className={`text-${tenantConfig.primaryColor}-100 mb-2`}>(555) 400-0002</p>
              <p className={`text-sm text-${tenantConfig.primaryColor}-200`}>Mon-Fri 8AM-6PM, Sat 9AM-2PM</p>
            </div>
            
            <div className="text-center">
              <Mail className={`h-12 w-12 mx-auto mb-4 text-${tenantConfig.primaryColor}-200`} />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className={`text-${tenantConfig.primaryColor}-100 mb-2`}>contact@flow-iq.ai</p>
              <p className={`text-sm text-${tenantConfig.primaryColor}-200`}>We reply within 24 hours</p>
            </div>
            
            <div className="text-center">
              <MapPin className={`h-12 w-12 mx-auto mb-4 text-${tenantConfig.primaryColor}-200`} />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className={`text-${tenantConfig.primaryColor}-100 mb-2`}>FlowIQ Headquarters</p>
              <p className={`text-sm text-${tenantConfig.primaryColor}-200`}>Innovation District</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="relative">
                <Brain className={`h-8 w-8 text-${tenantConfig.primaryColor}-400`} />
                <Activity className={`h-4 w-4 text-${tenantConfig.secondaryColor}-400 absolute -top-1 -right-1`} />
              </div>
              <div>
                <span className="text-xl font-semibold">{tenantConfig.brandName}</span>
                <p className="text-sm text-gray-400">AI-Powered {tenantConfig.specialty}</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2024 {tenantConfig.brandName}. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientLanding;
