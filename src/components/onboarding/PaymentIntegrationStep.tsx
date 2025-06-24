
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Shield, Check } from "lucide-react";
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

export const PaymentIntegrationStep: React.FC<PaymentIntegrationStepProps> = ({
  specialty,
  paymentConfig,
  onUpdatePaymentConfig
}) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const handleTogglePayments = (enabled: boolean) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      enablePayments: enabled
    });
  };

  const handlePaymentMethodToggle = (method: string, enabled: boolean) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      paymentMethods: {
        ...paymentConfig.paymentMethods,
        [method]: enabled
      }
    });
  };

  const handlePricingChange = (field: string, value: string | boolean) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      pricing: {
        ...paymentConfig.pricing,
        [field]: value
      }
    });
  };

  const handlePlanChange = (plan: string) => {
    onUpdatePaymentConfig({
      ...paymentConfig,
      subscriptionPlan: plan
    });
  };

  const subscriptionPlans = [
    {
      id: 'professional',
      name: 'Professional',
      price: '$49/month',
      features: ['Credit card processing', 'Basic reporting', 'Email receipts']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$99/month',
      features: ['All Professional features', 'Payment plans', 'Advanced analytics', 'Custom billing']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Contact us',
      features: ['All Premium features', 'Custom integrations', 'Dedicated support', 'White-label options']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Payment Setup</h2>
        <p className="text-gray-600 text-lg">
          Configure payment processing for your {specialtyConfig.brandName.toLowerCase()} practice
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Processing
              </CardTitle>
              <CardDescription>
                Enable secure payment collection from patients
              </CardDescription>
            </div>
            <Switch
              checked={paymentConfig.enablePayments}
              onCheckedChange={handleTogglePayments}
            />
          </div>
        </CardHeader>
        
        {paymentConfig.enablePayments && (
          <CardContent className="space-y-6">
            {/* Subscription Plans */}
            <div>
              <h4 className="font-medium mb-4">Choose Your Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all ${
                      paymentConfig.subscriptionPlan === plan.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {paymentConfig.subscriptionPlan === plan.id && (
                          <Check className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="font-medium mb-4">Payment Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Credit/Debit Cards</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentConfig.paymentMethods.creditCard}
                    onCheckedChange={(checked) => handlePaymentMethodToggle('creditCard', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Bank Transfer (ACH)</p>
                      <p className="text-sm text-gray-600">Direct bank account transfers</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentConfig.paymentMethods.bankTransfer}
                    onCheckedChange={(checked) => handlePaymentMethodToggle('bankTransfer', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Payment Plans</p>
                      <p className="text-sm text-gray-600">Allow patients to pay in installments</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentConfig.paymentMethods.paymentPlans}
                    onCheckedChange={(checked) => handlePaymentMethodToggle('paymentPlans', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Configuration */}
            <div>
              <h4 className="font-medium mb-4">Default Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consultationFee">Initial Consultation Fee</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    value={paymentConfig.pricing.consultationFee}
                    onChange={(e) => handlePricingChange('consultationFee', e.target.value)}
                    placeholder="150"
                  />
                </div>
                <div>
                  <Label htmlFor="followUpFee">Follow-up Visit Fee</Label>
                  <Input
                    id="followUpFee"
                    type="number"
                    value={paymentConfig.pricing.followUpFee}
                    onChange={(e) => handlePricingChange('followUpFee', e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Package Deals</p>
                  <p className="text-sm text-gray-600">Offer bundled services at discounted rates</p>
                </div>
                <Switch
                  checked={paymentConfig.pricing.packageDeals}
                  onCheckedChange={(checked) => handlePricingChange('packageDeals', checked)}
                />
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Security & Compliance</h4>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• PCI DSS compliant payment processing</li>
                <li>• End-to-end encryption for all transactions</li>
                <li>• HIPAA compliant patient data handling</li>
                <li>• Automated receipt generation and storage</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
