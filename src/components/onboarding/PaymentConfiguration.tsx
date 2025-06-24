
import React from 'react';
import { PaymentIntegrationStep } from './PaymentIntegrationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface PaymentConfigurationProps {
  specialty: SpecialtyType;
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
  onPaymentConfigUpdate: (config: any) => void;
}

export const PaymentConfiguration: React.FC<PaymentConfigurationProps> = ({ 
  specialty,
  paymentConfig, 
  onPaymentConfigUpdate 
}) => {
  // Transform the data structure to match what PaymentIntegrationStep expects
  const transformedConfig = {
    enablePayments: paymentConfig.enablePayments,
    subscriptionPlan: paymentConfig.subscriptionPlan,
    paymentMethods: {
      creditCard: true,
      bankTransfer: false,
      paymentPlans: false
    },
    pricing: {
      consultationFee: '150',
      followUpFee: '100',
      packageDeals: false
    }
  };

  const handleUpdate = (updatedConfig: any) => {
    // Transform back to the expected format
    const transformedBack = {
      enablePayments: updatedConfig.enablePayments,
      subscriptionPlan: updatedConfig.subscriptionPlan
    };
    onPaymentConfigUpdate(transformedBack);
  };

  return (
    <PaymentIntegrationStep
      specialty={specialty}
      paymentConfig={transformedConfig}
      onUpdatePaymentConfig={handleUpdate}
    />
  );
};
