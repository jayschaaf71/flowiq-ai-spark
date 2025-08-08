import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Wrench,
  Building2,
  Zap,
  Users,
  Settings,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  CreditCard,
  Sparkles,
  Shield,
  Clock,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    features: [] as string[],
    integrations: [] as string[],
    paymentMethod: '',
    plan: 'professional'
  });

  const businessTypes: BusinessType[] = [
    {
      id: 'hvac',
      name: 'HVAC Services',
      description: 'Heating, ventilation, and air conditioning services',
      icon: <Building2 className="h-6 w-6" />,
      features: ['Service Scheduling', 'Parts Tracking', 'Customer Communication', 'Maintenance Reminders'],
      color: 'bg-blue-500'
    },
    {
      id: 'plumbing',
      name: 'Plumbing Services',
      description: 'Plumbing installation, repair, and maintenance',
      icon: <Wrench className="h-6 w-6" />,
      features: ['Emergency Calls', 'Quote Management', 'Service Tracking', 'Customer Portal'],
      color: 'bg-green-500'
    },
    {
      id: 'electrical',
      name: 'Electrical Services',
      description: 'Electrical installation, repair, and safety compliance',
      icon: <Zap className="h-6 w-6" />,
      features: ['Project Management', 'Safety Compliance', 'Equipment Tracking', 'Time Tracking'],
      color: 'bg-yellow-500'
    },
    {
      id: 'consulting',
      name: 'Consulting Services',
      description: 'Professional consulting and advisory services',
      icon: <Users className="h-6 w-6" />,
      features: ['Client Management', 'Project Tracking', 'Billing Automation', 'Resource Planning'],
      color: 'bg-purple-500'
    },
    {
      id: 'other',
      name: 'Other Service Business',
      description: 'Custom service business configuration',
      icon: <Settings className="h-6 w-6" />,
      features: ['Custom Scheduling', 'Customer Communication', 'Service Management', 'Business Intelligence'],
      color: 'bg-gray-500'
    }
  ];

  const features = [
    { id: 'smart-scheduling', name: 'Smart Scheduling', description: 'AI-powered appointment booking', icon: <Calendar className="h-4 w-4" /> },
    { id: 'customer-communication', name: 'Customer Communication', description: 'Multi-channel messaging', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'voice-calls', name: 'Voice Calls', description: 'AI voice assistant and calls', icon: <Phone className="h-4 w-4" /> },
    { id: 'email-marketing', name: 'Email Marketing', description: 'Automated email campaigns', icon: <Mail className="h-4 w-4" /> },
    { id: 'sms-reminders', name: 'SMS Reminders', description: 'Automated text reminders', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'customer-portal', name: 'Customer Portal', description: 'Self-service customer portal', icon: <Globe className="h-4 w-4" /> },
    { id: 'analytics', name: 'Analytics', description: 'Business intelligence and reporting', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'integrations', name: 'Integrations', description: 'Connect with your existing tools', icon: <Settings className="h-4 w-4" /> }
  ];

  const integrations = [
    { id: 'google-calendar', name: 'Google Calendar', description: 'Sync with Google Calendar' },
    { id: 'quickbooks', name: 'QuickBooks', description: 'Connect with QuickBooks accounting' },
    { id: 'stripe', name: 'Stripe', description: 'Accept online payments' },
    { id: 'twilio', name: 'Twilio', description: 'SMS and voice communication' },
    { id: 'sendgrid', name: 'SendGrid', description: 'Email delivery service' },
    { id: 'zapier', name: 'Zapier', description: 'Connect with 5000+ apps' }
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$79',
      period: '/month',
      description: 'Perfect for small service businesses',
      features: ['Up to 100 customers', 'Basic communication tools', 'Email support', 'Standard templates'],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'Ideal for growing service businesses',
      features: ['Up to 500 customers', 'All communication tools', 'Priority support', 'Custom templates', 'Advanced analytics'],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$299',
      period: '/month',
      description: 'For large service businesses and franchises',
      features: ['Unlimited customers', 'All communication tools', '24/7 support', 'Custom integrations', 'Advanced security'],
      popular: false
    }
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to FlowIQ Connect',
      description: 'Let\'s get your service business set up in minutes',
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to FlowIQ Connect</h2>
            <p className="text-gray-600 mb-6">
              Transform your service business with AI-powered communication and scheduling. 
              Get set up in minutes and start managing your customers like a pro.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Quick Setup</h3>
              <p className="text-sm text-gray-600">Get started in under 5 minutes</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Secure & Reliable</h3>
              <p className="text-sm text-gray-600">Enterprise-grade security</p>
            </Card>
            
            <Card className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-600">Intelligent automation</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'business-info',
      title: 'Tell us about your business',
      description: 'Basic information to personalize your experience',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="Your Business Name"
              />
            </div>
            
            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Main St"
              />
            </div>
          </div>
          
          {formData.businessType && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Recommended for {businessTypes.find(t => t.id === formData.businessType)?.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                {businessTypes.find(t => t.id === formData.businessType)?.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )
    },
    {
      id: 'features',
      title: 'Choose your features',
      description: 'Select the features that will help your business grow',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Card 
                key={feature.id} 
                className={`p-4 cursor-pointer transition-all ${
                  formData.features.includes(feature.id) 
                    ? 'border-green-500 bg-green-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => {
                  const newFeatures = formData.features.includes(feature.id)
                    ? formData.features.filter(f => f !== feature.id)
                    : [...formData.features, feature.id];
                  setFormData({...formData, features: newFeatures});
                }}
              >
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={formData.features.includes(feature.id)}
                    onChange={() => {}}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {feature.icon}
                      <h3 className="font-semibold">{feature.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'integrations',
      title: 'Connect your tools',
      description: 'Integrate with your existing business tools',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <Card 
                key={integration.id} 
                className={`p-4 cursor-pointer transition-all ${
                  formData.integrations.includes(integration.id) 
                    ? 'border-green-500 bg-green-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => {
                  const newIntegrations = formData.integrations.includes(integration.id)
                    ? formData.integrations.filter(i => i !== integration.id)
                    : [...formData.integrations, integration.id];
                  setFormData({...formData, integrations: newIntegrations});
                }}
              >
                <div className="flex items-start gap-3">
                  <Checkbox 
                    checked={formData.integrations.includes(integration.id)}
                    onChange={() => {}}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'pricing',
      title: 'Choose your plan',
      description: 'Select the plan that fits your business needs',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`cursor-pointer transition-all ${
                  formData.plan === plan.id 
                    ? 'ring-2 ring-green-500 border-green-500' 
                    : 'hover:border-gray-300'
                } ${plan.popular ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => setFormData({...formData, plan: plan.id})}
              >
                {plan.popular && (
                  <div className="bg-green-600 text-white text-center py-2 text-sm font-semibold rounded-t-lg">
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
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'payment',
      title: 'Payment Information',
      description: 'Secure payment to get started',
      component: (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is encrypted and secure</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span>14-day free trial</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Then {plans.find(p => p.id === formData.plan)?.price}/month</span>
                <span className="font-semibold">{plans.find(p => p.id === formData.plan)?.price}</span>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'setup',
      title: 'Setting up your account',
      description: 'We\'re configuring everything for you',
      component: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Setting up your account</h3>
            <p className="text-gray-600 mb-6">This will only take a moment...</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span>Creating your business profile</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span>Configuring communication settings</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span>Setting up integrations</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span>Preparing your dashboard</span>
            </div>
          </div>
          
          <Progress value={75} className="w-full" />
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowIQ Connect</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {steps[currentStep].component}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 