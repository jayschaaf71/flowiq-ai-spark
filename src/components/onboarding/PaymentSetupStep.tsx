
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PaymentConfiguration } from './PaymentConfiguration';
import { PaymentBenefitsGrid } from './payment/PaymentBenefitsGrid';
import { PaymentStatusCard } from './payment/PaymentStatusCard';
import { PaymentActionButtons } from './payment/PaymentActionButtons';
import { PaymentSecurityNotice } from './payment/PaymentSecurityNotice';
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

  const handleTogglePayments = (enabled: boolean) => {
    if (enabled) {
      handleEnablePayments();
    } else {
      setPaymentConfig(prev => ({ ...prev, enablePayments: false }));
    }
  };

  const handlePaymentConfigUpdate = (config: any) => {
    setPaymentConfig(config);
  };

  const handleComplete = () => {
    onComplete(paymentConfig);
  };

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

      <PaymentBenefitsGrid />

      <PaymentStatusCard
        paymentConfig={paymentConfig}
        onTogglePayments={handleTogglePayments}
        onShowConfiguration={() => setShowPaymentConfig(true)}
      />

      <PaymentActionButtons
        paymentConfig={paymentConfig}
        onEnablePayments={handleEnablePayments}
        onComplete={handleComplete}
        onSkip={onSkip}
      />

      <PaymentSecurityNotice />
    </div>
  );
};
