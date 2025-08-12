import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Shield, 
  Clock, 
  Users, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  MessageSquare,
  FileText,
  DollarSign,
  Zap,
  Sparkles,
  Award,
  Globe,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Stethoscope,
  Building2,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MarketingHomepage: React.FC = () => {
  const navigate = useNavigate();

  const solutions = [
    {
      title: "Healthcare Solutions",
      description: "Specialized AI for medical practices",
      icon: <Stethoscope className="h-8 w-8" />,
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-blue-50",
      features: ["HIPAA Compliant", "SOAP Notes", "Insurance Claims", "Patient Management"],
      specialties: [
        { name: "Chiropractic Care", description: "Complete practice management for chiropractors" },
        { name: "Dental Sleep Medicine", description: "Specialized tools for sleep medicine practices" },
        { name: "Medical Practices", description: "Comprehensive healthcare practice management" }
      ],
      cta: "Explore Healthcare Solutions",
      route: "/healthcare",
      badge: "Healthcare"
    },
    {
      title: "Service Business Solutions",
      description: "FlowIQ Connect for any service business",
      icon: <Wrench className="h-8 w-8" />,
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-green-50",
      features: ["Smart Scheduling", "Customer Communication", "Service Management", "Business Intelligence"],
      specialties: [
        { name: "HVAC Services", description: "Complete HVAC business management" },
        { name: "Plumbing Services", description: "Professional plumbing business tools" },
        { name: "Electrical Services", description: "Electrical contractor management" },
        { name: "Consulting Services", description: "Professional consulting business tools" }
      ],
      cta: "Explore Business Solutions",
      route: "/connect",
      badge: "Service Business"
    }
  ];

  const healthcareFeatures = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI-Powered Workflows",
      description: "Intelligent automation that learns and adapts to your practice needs"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with full HIPAA compliance built-in"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Optimized performance with sub-2 second load times"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Specialty",
      description: "Tailored solutions for chiropractic, dental sleep, and more"
    }
  ];

  const businessFeatures = [
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
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      practice: "West County Spine & Joint",
      specialty: "Chiropractic",
      content: "FlowIQ has transformed our practice. The AI-powered SOAP notes save us hours every day.",
      rating: 5,
      type: "healthcare"
    },
    {
      name: "Mike Rodriguez",
      practice: "Rodriguez HVAC Services",
      specialty: "HVAC",
      content: "FlowIQ Connect has streamlined our entire operation. Customer communication is now effortless.",
      rating: 5,
      type: "business"
    },
    {
      name: "Dr. Michael Chen",
      practice: "Midwest Dental Sleep Medicine",
      specialty: "Dental Sleep Medicine",
      content: "The sleep study management and DME tracking features are game-changers for our practice.",
      rating: 5,
      type: "healthcare"
    },
    {
      name: "Lisa Thompson",
      practice: "Thompson Plumbing Co.",
      specialty: "Plumbing",
      content: "The smart scheduling and customer communication features have increased our efficiency by 40%.",
      rating: 5,
      type: "business"
    }
  ];

  const pricing = {
    healthcare: [
      {
        name: "Starter",
        price: "$99",
        period: "/month",
        description: "Perfect for small practices getting started",
        features: [
          "Up to 500 patients",
          "Basic AI agents",
          "Email support",
          "Standard templates"
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
          "Advanced analytics"
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
    ],
    business: [
      {
        name: "Starter",
        price: "$79",
        period: "/month",
        description: "Perfect for small service businesses",
        features: [
          "Up to 100 customers",
          "Basic communication tools",
          "Email support",
          "Standard templates"
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
          "Advanced analytics"
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
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
              <a href="#solutions" className="text-gray-600 hover:text-gray-900">Solutions</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Sign In
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
              <Badge className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Business Management
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Business</span>
              <br />
              with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
              From healthcare practices to service businesses, FlowIQ provides intelligent automation 
              that transforms how you work. Choose your path and discover the future of business management.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg">
                Explore Solutions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
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

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're in healthcare or service business, we have a specialized solution for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${solution.bgColor}`} onClick={() => navigate(solution.route)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={`bg-gradient-to-r ${solution.color} text-white`}>
                      {solution.badge}
                    </Badge>
                    <div className={`w-12 h-12 bg-gradient-to-r ${solution.color} rounded-lg flex items-center justify-center text-white`}>
                      {solution.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{solution.title}</CardTitle>
                  <CardDescription className="text-lg">{solution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {solution.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Specialties:</h4>
                      <div className="space-y-1">
                        {solution.specialties.map((specialty, specialtyIndex) => (
                          <div key={specialtyIndex} className="text-sm text-gray-600">
                            • {specialty.name} - {specialty.description}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90 text-white`}>
                      {solution.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI-powered automation that adapts to your specific needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Healthcare Features */}
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Healthcare Solutions</h3>
                <p className="text-gray-600">Specialized features for medical practices</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {healthcareFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Business Features */}
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Business Solutions</h3>
                <p className="text-gray-600">FlowIQ Connect for any service business</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {businessFeatures.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers are saying about FlowIQ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Badge className={`mr-3 ${testimonial.type === 'healthcare' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {testimonial.type === 'healthcare' ? 'Healthcare' : 'Service Business'}
                    </Badge>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${testimonial.type === 'healthcare' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'} rounded-full flex items-center justify-center mr-3`}>
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
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business size and needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Healthcare Pricing */}
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Healthcare Plans</h3>
                <p className="text-gray-600">Specialized pricing for medical practices</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {pricing.healthcare.map((plan, index) => (
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

            {/* Business Pricing */}
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Business Plans</h3>
                <p className="text-gray-600">FlowIQ Connect pricing for service businesses</p>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {pricing.business.map((plan, index) => (
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who trust FlowIQ to manage their business
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
                AI-powered business management for healthcare and service businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/healthcare" className="hover:text-white">Healthcare</a></li>
                <li><a href="/connect" className="hover:text-white">Service Business</a></li>
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
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