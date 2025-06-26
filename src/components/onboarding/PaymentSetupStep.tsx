import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  DollarSign, 
  Shield, 
  Check, 
  ArrowRight,
  Zap,
  Building
} from 'lucide-react';
import { PaymentConfiguration } from './PaymentConfiguration';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface PaymentSetupStepProps {
  specialty: SpecialtyType;
  onComplete: (paymentConfig: any) => void;
  onSkip: () => void;
  initialConfig?: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
}

export const PaymentSetupStep: React.FC<PaymentSetupStepProps> = ({
  specialty,
  onComplete,
  onSkip,
  initialConfig = {
    enablePayments: false,
    subscriptionPlan: 'professional'
  }
}) => {
  const [showPaymentConfig, setShowPaymentConfig] = useState(initialConfig.enablePayments);
  const [paymentConfig, setPaymentConfig] = useState(initialConfig);

  const handleEnablePayments = () => {
    setPaymentConfig(prev => ({ ...prev, enablePayments: true }));
    setShowPaymentConfig(true);
  };

  const handlePaymentConfigUpdate = (config: any) => {
    setPaymentConfig(config);
  };

  const handleComplete = () => {
    onComplete(paymentConfig);
  };

  const benefits = [
    {
      icon: CreditCard,
      title: "Secure Payment Processing",
      description: "Accept credit cards, debit cards, and bank transfers securely"
    },
    {
      icon: Zap,
      title: "Automated Billing",
      description: "Automatic invoice generation and payment reminders"
    },
    {
      icon: Building,
      title: "Payment Plans",
      description: "Offer flexible payment options to your patients"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "All payment data is encrypted and HIPAA compliant"
    }
  ];

  if (showPaymentConfig) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Payment Setup</h2>
            <p className="text-gray-600">Configure payment processing for your practice</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowPaymentConfig(false)}
          >
            ← Back to Overview
          </Button>
        </div>

        <PaymentConfiguration
          specialty={specialty}
          paymentConfig={paymentConfig}
          onPaymentConfigUpdate={handlePaymentConfigUpdate}
        />

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onSkip}>
            Skip for now
          </Button>
          <Button onClick={handleComplete}>
            Complete Payment Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Payment Processing</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Enable secure payment processing to streamline your billing and improve cash flow
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Status */}
      <Card className={paymentConfig.enablePayments ? "border-green-200" : "border-gray-200"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Processing
                {paymentConfig.enablePayments && (
                  <Badge className="bg-green-100 text-green-700">
                    <Check className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {paymentConfig.enablePayments 
                  ? "Payment processing is enabled for your practice"
                  : "Enable secure payment processing for your patients"
                }
              </CardDescription>
            </div>
            <Switch
              checked={paymentConfig.enablePayments}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleEnablePayments();
                } else {
                  setPaymentConfig(prev => ({ ...prev, enablePayments: false }));
                }
              }}
            />
          </div>
        </CardHeader>
        
        {paymentConfig.enablePayments && (
          <CardContent>
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Payment processing enabled:</strong> Your practice can now accept secure payments from patients.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button onClick={() => setShowPaymentConfig(true)}>
                  Configure Payment Settings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Setup Options */}
      {!paymentConfig.enablePayments && (
        <div className="text-center space-y-4">
          <Button 
            onClick={handleEnablePayments}
            size="lg"
            className="px-8"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Enable Payment Processing
          </Button>
          
          <p className="text-sm text-gray-600">
            Takes less than 5 minutes to set up • PCI DSS compliant • HIPAA secure
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onSkip}>
          Skip for now - I'll set this up later
        </Button>
        
        {paymentConfig.enablePayments && (
          <Button onClick={handleComplete}>
            Continue with Current Settings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Security Notice */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Security & Compliance:</strong> All payment processing is PCI DSS compliant and HIPAA secure. 
          Patient payment data is encrypted end-to-end and never stored on your servers.
        </AlertDescription>
      </Alert>
    </div>
  );
};
