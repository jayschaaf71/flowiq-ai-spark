import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope,
  Shield,
  Bot,
  Zap,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  MessageSquare,
  FileText,
  DollarSign,
  Sparkles,
  Award,
  Phone,
  Mail,
  ClipboardList,
  Activity,
  UserCheck,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HealthcareLanding: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI-Powered SOAP Notes",
      description: "Automated clinical documentation that saves hours per day"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with full HIPAA compliance built-in"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "Intelligent appointment booking with conflict resolution"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Patient Communication",
      description: "Automated reminders, follow-ups, and patient engagement"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Insurance Claims",
      description: "Streamlined claims processing and verification"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Practice Analytics",
      description: "Comprehensive insights to optimize your practice"
    }
  ];

  const specialties = [
    {
      name: "Chiropractic Care",
      description: "Complete practice management for chiropractors",
      features: ["SOAP Notes", "Treatment Plans", "Patient Scheduling", "Revenue Management"],
      color: "bg-green-500",
      route: "/chiropractic"
    },
    {
      name: "Dental Sleep Medicine",
      description: "Specialized tools for sleep medicine practices",
      features: ["Sleep Studies", "DME Tracking", "Insurance Claims", "Compliance Monitoring"],
      color: "bg-purple-500",
      route: "/dental-sleep"
    },
    {
      name: "Medical Practices",
      description: "Comprehensive healthcare practice management",
      features: ["EHR Integration", "Claims Processing", "Patient Portal", "Telemedicine"],
      color: "bg-blue-500",
      route: "/medical"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      practice: "West County Spine & Joint",
      specialty: "Chiropractic",
      content: "FlowIQ has transformed our practice. The AI-powered SOAP notes save us hours every day.",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      practice: "Midwest Dental Sleep Medicine",
      specialty: "Dental Sleep Medicine",
      content: "The sleep study management and DME tracking features are game-changers for our practice.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      practice: "Rodriguez Medical Group",
      specialty: "Family Medicine",
      content: "The patient communication and insurance claims features have streamlined our entire operation.",
      rating: 5
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small practices getting started",
      features: [
        "Up to 500 patients",
        "Basic AI agents",
        "Email support",
        "Standard templates",
        "HIPAA compliance"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$199",
      period: "/month",
      description: "Ideal for growing practices",
      features: [
        "Up to 2,000 patients",
        "All AI agents",
        "Priority support",
        "Custom templates",
        "Advanced analytics",
        "Insurance integration"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/month",
      description: "For large practices and multi-location",
      features: [
        "Unlimited patients",
        "All AI agents",
        "24/7 support",
        "Custom integrations",
        "Advanced security",
        "Dedicated account manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowIQ</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#specialties" className="text-gray-600 hover:text-gray-900">Specialties</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
                <Stethoscope className="w-4 h-4 mr-2" />
                Healthcare Solutions
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              The Future of
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Healthcare</span>
              <br />
              is Here
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
              FlowIQ is the AI-native practice management platform that transforms how healthcare professionals work. 
              From automated SOAP notes to intelligent scheduling, we're revolutionizing healthcare workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                HIPAA Compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Healthcare Professionals Choose FlowIQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for healthcare workflows with AI that understands your practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Specialized Solutions for Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored workflows and AI agents designed for your specialty
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate(specialty.route)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{specialty.name}</CardTitle>
                      <CardDescription className="text-lg">{specialty.description}</CardDescription>
                    </div>
                    <div className={`w-12 h-12 ${specialty.color} rounded-lg flex items-center justify-center`}>
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {specialty.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6" variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers are saying about FlowIQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.practice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your practice size and needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-lg">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals who trust FlowIQ to manage their practice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FlowIQ</span>
              </div>
              <p className="text-gray-400">
                The AI-native practice management platform for healthcare professionals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#specialties" className="hover:text-white">Specialties</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FlowIQ. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}; 