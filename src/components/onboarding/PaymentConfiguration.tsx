
import React from 'react';
import { PaymentIntegrationStep } from './PaymentIntegrationStep';

interface PaymentConfigurationProps {
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
  onPaymentConfigUpdate: (config: any) => void;
}

export const PaymentConfiguration: React.FC<PaymentConfigurationProps> = ({ 
  paymentConfig, 
  onPaymentConfigUpdate 
}) => {
  return (
    <PaymentIntegrationStep
      paymentConfig={paymentConfig}
      onUpdatePaymentConfig={onPaymentConfigUpdate}
    />
  );
};
