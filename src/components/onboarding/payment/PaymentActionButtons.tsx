
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowRight } from 'lucide-react';

interface PaymentActionButtonsProps {
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
  onEnablePayments: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

export const PaymentActionButtons: React.FC<PaymentActionButtonsProps> = ({
  paymentConfig,
  onEnablePayments,
  onComplete,
  onSkip
}) => {
  return (
    <>
      {/* Quick Setup Options */}
      {!paymentConfig.enablePayments && (
        <div className="text-center space-y-4">
          <Button 
            onClick={onEnablePayments}
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
          <Button onClick={onComplete}>
            Continue with Current Settings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </>
  );
};
