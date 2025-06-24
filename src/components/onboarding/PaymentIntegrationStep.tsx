
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface PaymentIntegrationStepProps {
  specialty: SpecialtyType;
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
    paymentMethods: {
      creditCard: boolean;
      bankTransfer: boolean;
      paymentPlans: boolean;
    };
    pricing: {
      consultationFee: string;
      followUpFee: string;
      packageDeals: boolean;
    };
  };
  onUpdatePaymentConfig: (config: any) => void;
}

export const PaymentIntegrationStep = ({ 
  specialty, 
  paymentConfig, 
  onUpdatePaymentConfig 
}: PaymentIntegrationStepProps) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const subscriptionPlans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: '$49/month',
      features: ['Up to 100 patients', 'Basic AI features', 'Email support'],
      recommended: false
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: '$149/month',
      features: ['Up to 500 patients', 'Advanced AI features', 'Priority support', 'Custom branding'],
      recommended: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '$299/month',
      features: ['Unlimited patients', 'Full AI suite', '24/7 support', 'White label', 'API access'],
      recommended: false
    }
  ];

  const handlePaymentToggle = (setting: string, enabled: boolean) => {
    if (setting === 'enablePayments') {
      onUpdatePaymentConfig({
        ...paymentConfig,
        enablePayments: enabled
      });
    } else if (setting.startsWith('paymentMethods.')) {
      const method = setting.split('.')[1];
      onUpdatePaymentConfig({
        ...paymentConfig,
        paymentMethods: {
          ...paymentConfig.paymentMethods,
          [method]: enabled
        }
      });
    }
  };

  const handlePricingChange = (field: string, value: string) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      pricing: {
        ...paymentConfig.pricing,
        [field]: value
      }
    });
  };

  const handlePlanSelect = (planId: string) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      subscriptionPlan: planId
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Payment Integration</h2>
        <p className="text-gray-600 text-lg">
          Set up your subscription plan and payment processing for your {specialtyConfig.brandName.toLowerCase()} practice.
        </p>
      </div>

      {/* Subscription Plan Selection */}
      <Card className="border-2" style={{ borderColor: specialtyConfig.primaryColor + '20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            Choose Your Plan
          </CardTitle>
          <CardDescription>
            Select the plan that best fits your practice size and needs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`cursor-pointer transition-all duration-200 ${
                  paymentConfig.subscriptionPlan === plan.id
                    ? 'shadow-lg' 
                    : 'border hover:border-gray-300'
                } ${plan.recommended ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  borderWidth: paymentConfig.subscriptionPlan === plan.id ? '2px' : '1px',
                  borderColor: paymentConfig.subscriptionPlan === plan.id ? specialtyConfig.primaryColor : undefined,
                  backgroundColor: paymentConfig.subscriptionPlan === plan.id ? specialtyConfig.primaryColor + '05' : undefined
                }}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.recommended && (
                      <Badge 
                        style={{ 
                          backgroundColor: specialtyConfig.primaryColor,
                          color: 'white'
                        }}
                      >
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: specialtyConfig.primaryColor }}>
                    {plan.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Choose which payment methods to accept from your patients.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Payment Processing</Label>
              <p className="text-sm text-gray-600">Allow patients to pay online</p>
            </div>
            <Switch
              checked={paymentConfig.enablePayments}
              onCheckedChange={(checked) => handlePaymentToggle('enablePayments', checked)}
            />
          </div>

          {paymentConfig.enablePayments && (
            <div className="space-y-4 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Credit/Debit Cards</Label>
                  <p className="text-sm text-gray-600">Visa, Mastercard, Amex</p>
                </div>
                <Switch
                  checked={paymentConfig.paymentMethods.creditCard}
                  onCheckedChange={(checked) => handlePaymentToggle('paymentMethods.creditCard', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Bank Transfer (ACH)</Label>
                  <p className="text-sm text-gray-600">Direct bank transfers</p>
                </div>
                <Switch
                  checked={paymentConfig.paymentMethods.bankTransfer}
                  onCheckedChange={(checked) => handlePaymentToggle('paymentMethods.bankTransfer', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Payment Plans</Label>
                  <p className="text-sm text-gray-600">Installment options</p>
                </div>
                <Switch
                  checked={paymentConfig.paymentMethods.paymentPlans}
                  onCheckedChange={(checked) => handlePaymentToggle('paymentMethods.paymentPlans', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      {paymentConfig.enablePayments && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
              Service Pricing
            </CardTitle>
            <CardDescription>
              Set your default pricing for common services. You can adjust these later.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="consultationFee">Initial Consultation Fee</Label>
              <Input
                id="consultationFee"
                type="number"
                placeholder="150"
                value={paymentConfig.pricing.consultationFee}
                onChange={(e) => handlePricingChange('consultationFee', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="followUpFee">Follow-up Visit Fee</Label>
              <Input
                id="followUpFee"
                type="number"
                placeholder="100"
                value={paymentConfig.pricing.followUpFee}
                onChange={(e) => handlePricingChange('followUpFee', e.target.value)}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security & Compliance */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-900">Security & Compliance</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800">Fraud Protection</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
