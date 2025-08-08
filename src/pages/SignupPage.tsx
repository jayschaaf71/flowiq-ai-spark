import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Sparkles, 
  Users, 
  Calendar,
  Bot,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    practiceName: '',
    specialty: '',
    practiceSize: '',
    website: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const specialties = [
    { value: 'chiropractic', label: 'Chiropractic Care', description: 'Spinal health and wellness' },
    { value: 'dental-sleep', label: 'Dental Sleep Medicine', description: 'Sleep apnea and sleep disorders' },
    { value: 'dental', label: 'General Dentistry', description: 'Comprehensive dental care' },
    { value: 'medical-spa', label: 'Medical Spa', description: 'Aesthetic and wellness services' },
    { value: 'physical-therapy', label: 'Physical Therapy', description: 'Rehabilitation and recovery' },
    { value: 'other', label: 'Other Specialty', description: 'Custom healthcare practice' }
  ];

  const practiceSizes = [
    { value: '1-5', label: '1-5 staff members' },
    { value: '6-15', label: '6-15 staff members' },
    { value: '16-50', label: '16-50 staff members' },
    { value: '50+', label: '50+ staff members' }
  ];

  const benefits = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "AI-Powered Workflows",
      description: "Automated SOAP notes, scheduling, and patient management"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with full compliance built-in"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast Setup",
      description: "Get started in minutes, not weeks"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-User Access",
      description: "Unlimited staff members with role-based permissions"
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.firstName && formData.lastName && formData.email && formData.practiceName) {
      setStep(2);
    } else if (step === 2 && formData.specialty && formData.practiceSize) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    // Here you would integrate with your backend to create the account
    console.log('Creating account with data:', formData);
    
    // Simulate account creation
    setTimeout(() => {
      navigate('/onboarding', { state: { formData } });
    }, 2000);
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.practiceName;
    }
    if (step === 2) {
      return formData.specialty && formData.practiceSize;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowIQ</span>
            </div>
            
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Signup Form */}
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Start Your Free Trial
              </h1>
              <p className="text-gray-600">
                Join thousands of healthcare professionals using FlowIQ
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@yourpractice.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="practiceName">Practice Name *</Label>
                  <Input
                    id="practiceName"
                    value={formData.practiceName}
                    onChange={(e) => handleInputChange('practiceName', e.target.value)}
                    placeholder="Your Practice Name"
                  />
                </div>

                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Practice Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="specialty">Practice Specialty *</Label>
                  <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.value} value={specialty.value}>
                          <div>
                            <div className="font-medium">{specialty.label}</div>
                            <div className="text-sm text-gray-500">{specialty.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="practiceSize">Practice Size *</Label>
                  <Select value={formData.practiceSize} onValueChange={(value) => handleInputChange('practiceSize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice size" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Practice Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourpractice.com"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex-1"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Terms and Final Step */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy *
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked) => handleInputChange('agreeToMarketing', checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="agreeToMarketing" className="text-sm">
                        I agree to receive marketing communications from FlowIQ
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Secure & HIPAA Compliant</h4>
                      <p className="text-sm text-blue-700">
                        Your data is protected with enterprise-grade security and full HIPAA compliance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.agreeToTerms}
                    className="flex-1"
                  >
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                  Why Choose FlowIQ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle>Free Trial Includes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">All features included</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/login')}>
                  Sign in here
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 