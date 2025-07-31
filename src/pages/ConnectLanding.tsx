import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench,
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
  Settings,
  Building2,
  Clock,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConnectLanding: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "AI-powered appointment booking and service scheduling"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Customer Communication",
      description: "Multi-channel communication with SMS, email, and voice"
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Service Management",
      description: "Complete service tracking and customer management"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Business Intelligence",
      description: "Analytics and insights to grow your service business"
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI Assistant",
      description: "Intelligent automation that handles customer inquiries"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Track efficiency, customer satisfaction, and growth metrics"
    }
  ];

  const serviceTypes = [
    {
      name: "HVAC Services",
      description: "Complete HVAC business management",
      features: ["Service Scheduling", "Parts Tracking", "Customer Communication", "Maintenance Reminders"],
      color: "bg-blue-500",
      icon: <Building2 className="h-6 w-6 text-white" />
    },
    {
      name: "Plumbing Services",
      description: "Professional plumbing business tools",
      features: ["Emergency Calls", "Quote Management", "Service Tracking", "Customer Portal"],
      color: "bg-green-500",
      icon: <Wrench className="h-6 w-6 text-white" />
    },
    {
      name: "Electrical Services",
      description: "Electrical contractor management",
      features: ["Project Management", "Safety Compliance", "Equipment Tracking", "Time Tracking"],
      color: "bg-yellow-500",
      icon: <Zap className="h-6 w-6 text-white" />
    },
    {
      name: "Consulting Services",
      description: "Professional consulting business tools",
      features: ["Client Management", "Project Tracking", "Billing Automation", "Resource Planning"],
      color: "bg-purple-500",
      icon: <Users className="h-6 w-6 text-white" />
    }
  ];

  const testimonials = [
    {
      name: "Mike Rodriguez",
      business: "Rodriguez HVAC Services",
      service: "HVAC",
      content: "FlowIQ Connect has streamlined our entire operation. Customer communication is now effortless.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      business: "Thompson Plumbing Co.",
      service: "Plumbing",
      content: "The smart scheduling and customer communication features have increased our efficiency by 40%.",
      rating: 5
    },
    {
      name: "David Chen",
      business: "Chen Electrical Contractors",
      service: "Electrical",
      content: "The project management and safety compliance features are exactly what we needed.",
      rating: 5
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$79",
      period: "/month",
      description: "Perfect for small service businesses",
      features: [
        "Up to 100 customers",
        "Basic communication tools",
        "Email support",
        "Standard templates",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "Ideal for growing service businesses",
      features: [
        "Up to 500 customers",
        "All communication tools",
        "Priority support",
        "Custom templates",
        "Advanced analytics",
        "API access"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      description: "For large service businesses and franchises",
      features: [
        "Unlimited customers",
        "All communication tools",
        "24/7 support",
        "Custom integrations",
        "Advanced security",
        "Dedicated account manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowIQ Connect</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#services" className="text-gray-600 hover:text-gray-900">Services</a>
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
              <Badge className="bg-green-100 text-green-700 px-4 py-2">
                <Wrench className="w-4 h-4 mr-2" />
                Service Business Solutions
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Service Business</span>
              <br />
              with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
              FlowIQ Connect is the AI-powered communication platform that transforms how service businesses work. 
              From smart scheduling to customer communication, we're revolutionizing service business management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg">
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
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Cancel anytime
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
              Why Service Businesses Choose FlowIQ Connect
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for service business workflows with AI that understands your industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
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

      {/* Service Types Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfect for Any Service Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored solutions for different service industries
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceTypes.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{service.name}</CardTitle>
                      <CardDescription className="text-lg">{service.description}</CardDescription>
                    </div>
                    <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center`}>
                      {service.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {service.features.map((feature, featureIndex) => (
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
              Trusted by Service Business Owners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers are saying about FlowIQ Connect
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
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.business}</p>
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
              Choose the plan that fits your business size and needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg ${plan.popular ? 'ring-2 ring-green-600' : ''}`}>
                {plan.popular && (
                  <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold">
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
                  <Button className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                    {plan.popular ? 'Start Free Trial' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Service Business?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of service business owners who trust FlowIQ Connect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg">
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">FlowIQ Connect</span>
              </div>
              <p className="text-gray-400">
                The AI-powered communication platform for service businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#services" className="hover:text-white">Services</a></li>
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
              © 2024 FlowIQ Connect. All rights reserved.
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