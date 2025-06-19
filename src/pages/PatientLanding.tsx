
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
  Activity,
  Play
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
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">FlowIQ</span>
              <span className="text-sm text-gray-600 ml-2">The AI Business Operating System</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Product</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/admin")}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                🎯 AI Assessment
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Play className="h-4 w-4 mr-1" />
                Demo
              </Button>
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/patient-auth")}
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The AI Operating System for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Professional Practices
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your practice with FlowIQ's specialized AI agents. Automate scheduling, 
            insurance verification, appointment reminders, patient follow-up, claims processing, and 
            business intelligence seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
              onClick={() => navigate("/patient-auth")}
            >
              🎯 Book Free AI Assessment
            </Button>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              onClick={() => navigate("/patient-auth")}
            >
              <Play className="mr-2 h-5 w-5" />
              Try Live Demo
            </Button>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() => navigate("/patient-auth")}
            >
              Book a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="lg"
            className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-lg"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Six AI Agents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Six AI Agents, One Powerful System
          </h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Each FlowIQ agent specializes in automating a critical aspect of your practice 
            operations, working together to deliver exceptional patient experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Schedule iQ", description: "Intelligent appointment scheduling", color: "blue" },
              { name: "Intake iQ", description: "Automated patient intake forms", color: "green" },
              { name: "Remind iQ", description: "Smart appointment reminders", color: "purple" },
              { name: "Billing iQ", description: "Streamlined billing processes", color: "orange" },
              { name: "Claims iQ", description: "Automated claims processing", color: "teal" },
              { name: "Assist iQ", description: "AI-powered patient support", color: "pink" }
            ].map((agent, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardHeader className="pb-4">
                  <div className={`h-12 w-12 mx-auto mb-4 bg-${agent.color}-100 rounded-lg flex items-center justify-center`}>
                    <Brain className={`h-6 w-6 text-${agent.color}-600`} />
                  </div>
                  <CardTitle className="text-xl font-semibold">{agent.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{agent.description}</p>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
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
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-8 bg-white border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-gray-900">Ready to Get Started?</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Experience AI-powered {tenantConfig.specialty.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                    ✓ AI-powered scheduling recommendations<br/>
                    ✓ Intelligent intake form processing<br/>
                    ✓ Automated workflow management<br/>
                    ✓ Real-time availability updates
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                    onClick={() => navigate(user ? "/book-appointment" : "/patient-auth")}
                  >
                    {user ? "Book Appointment Now" : "Get Started Today"}
                    <Calendar className="ml-2 h-5 w-5" />
                  </Button>
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
            <h2 className="text-4xl font-bold mb-4">
              Contact FlowIQ
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Have questions about our AI-powered platform? 
              We're here to help you transform your healthcare experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-blue-100 mb-2">(555) 400-0002</p>
              <p className="text-sm text-blue-200">Mon-Fri 8AM-6PM, Sat 9AM-2PM</p>
            </div>
            
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-blue-100 mb-2">contact@flow-iq.ai</p>
              <p className="text-sm text-blue-200">We reply within 24 hours</p>
            </div>
            
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-blue-100 mb-2">FlowIQ Headquarters</p>
              <p className="text-sm text-blue-200">Innovation District</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <span className="text-xl font-semibold">FlowIQ</span>
              <p className="text-sm text-gray-400">The AI Business Operating System</p>
            </div>
            
            <div className="text-sm text-gray-400">
              © 2024 FlowIQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientLanding;
