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
  Settings
} from "lucide-react";

export const PatientLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments 24/7 with real-time availability"
    },
    {
      icon: Clock,
      title: "Flexible Times", 
      description: "Choose from morning, afternoon, and evening slots"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health information is protected and encrypted"
    },
    {
      icon: Star,
      title: "Quality Care",
      description: "Expert providers committed to your health and wellness"
    }
  ];

  const services = [
    "Regular Cleanings & Checkups",
    "Cosmetic Dentistry",
    "Oral Surgery",
    "Pediatric Dentistry",
    "Emergency Care",
    "Teeth Whitening"
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
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Calendar className="h-16 w-16 text-blue-600" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Health,{" "}
              <span className="text-blue-600">Your Schedule</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Book appointments online, manage your health records, and connect with 
              our expert medical team—all from one convenient patient portal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4"
                  onClick={() => navigate("/patient-dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4"
                    onClick={() => navigate("/patient-auth")}
                  >
                    Book Appointment
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-4"
                    onClick={() => navigate("/patient-auth")}
                  >
                    Sign In
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
              Why Choose Our Patient Portal?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience healthcare the modern way with our easy-to-use online platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
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
                Comprehensive Healthcare Services
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our experienced team of healthcare professionals provides a full range 
                of medical and dental services to keep you and your family healthy.
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
            
            <Card className="p-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-blue-600">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg">
                  Book your appointment in just a few minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600">
                    ✓ Choose your preferred provider<br/>
                    ✓ Select convenient date & time<br/>
                    ✓ Get instant confirmation<br/>
                    ✓ Receive appointment reminders
                  </div>
                  
                  {user ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => navigate("/book-appointment")}
                    >
                      Book Appointment Now
                      <Calendar className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
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
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help? We're Here for You
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our friendly staff is ready to assist you with any questions about 
              appointments, services, or using the patient portal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100 mb-2">(555) 123-4567</p>
              <p className="text-sm text-blue-200">Mon-Fri 8AM-6PM</p>
            </div>
            
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100 mb-2">info@clinic.com</p>
              <p className="text-sm text-blue-200">We reply within 24 hours</p>
            </div>
            
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-blue-100 mb-2">123 Healthcare Ave</p>
              <p className="text-sm text-blue-200">City, State 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Calendar className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-semibold">Healthcare Portal</span>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2024 Healthcare Portal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientLanding;
