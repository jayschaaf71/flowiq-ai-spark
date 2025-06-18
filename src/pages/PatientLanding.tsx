
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
  Stethoscope,
  Activity
} from "lucide-react";

export const PatientLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book chiropractic appointments 24/7 with real-time availability"
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
      description: "Experienced chiropractors dedicated to your spinal health"
    }
  ];

  const services = [
    "Chiropractic Adjustments",
    "Spinal Decompression Therapy",
    "Physical Rehabilitation",
    "Sports Injury Treatment",
    "Auto Accident Recovery",
    "Chronic Pain Management",
    "Wellness & Prevention Care",
    "Custom Treatment Plans"
  ];

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
      <section className="bg-gradient-to-br from-green-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Stethoscope className="h-16 w-16 text-green-600" />
                <Activity className="h-8 w-8 text-blue-600 absolute -top-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">West County</span>{" "}
              <span className="text-blue-600">Spine & Joint</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-2 font-semibold">
              Chiropractic & Wellness Center
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience relief from pain and improved mobility with our comprehensive 
              chiropractic care. Book your appointment online and take the first step 
              toward better spinal health and overall wellness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
                  onClick={() => navigate("/patient-dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700"
                    onClick={() => navigate("/patient-auth")}
                  >
                    Book Appointment
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4 border-green-600 text-green-600 hover:bg-green-50"
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
              Why Choose West County Spine & Joint?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced chiropractic care with a patient-centered approach to healing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
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
                Comprehensive Chiropractic Services
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our experienced team of chiropractors provides a full range of services 
                to address spine and joint issues, helping you achieve optimal health 
                and pain-free living.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-green-700">Ready to Feel Better?</CardTitle>
                <CardDescription className="text-lg text-gray-700">
                  Schedule your consultation today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600 bg-white/70 p-4 rounded-lg">
                    ✓ Initial consultation & examination<br/>
                    ✓ Personalized treatment plan<br/>
                    ✓ Insurance verification assistance<br/>
                    ✓ Same-day appointments available
                  </div>
                  
                  {user ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      size="lg"
                      onClick={() => navigate("/book-appointment")}
                    >
                      Book Appointment Now
                      <Calendar className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
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
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Contact West County Spine & Joint
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Have questions about our chiropractic services? We're here to help 
              you on your journey to better health and wellness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-green-100 mb-2">(555) 400-0002</p>
              <p className="text-sm text-green-200">Mon-Fri 8AM-6PM, Sat 9AM-2PM</p>
            </div>
            
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-green-100 mb-2">contact@westcountyspine.com</p>
              <p className="text-sm text-green-200">We reply within 24 hours</p>
            </div>
            
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-green-200" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-green-100 mb-2">123 Wellness Drive</p>
              <p className="text-sm text-green-200">West County, MO 63021</p>
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
                <Stethoscope className="h-8 w-8 text-green-400" />
                <Activity className="h-4 w-4 text-blue-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <span className="text-xl font-semibold">West County Spine & Joint</span>
                <p className="text-sm text-gray-400">Chiropractic & Wellness Center</p>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2024 West County Spine & Joint. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientLanding;
