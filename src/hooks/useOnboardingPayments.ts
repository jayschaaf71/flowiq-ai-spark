
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface PaymentOnboardingConfig {
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
}

export const useOnboardingPayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const savePaymentConfig = useCallback(async (config: PaymentOnboardingConfig) => {
    setIsLoading(true);
    try {
      // Here you would typically save to your backend/database
      console.log('Saving payment configuration:', config);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Payment Settings Saved",
        description: config.enablePayments 
          ? "Payment processing has been enabled for your practice" 
          : "Payment settings have been saved",
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving payment config:', error);
      toast({
        title: "Error Saving Settings",
        description: "Failed to save payment configuration. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const validatePaymentConfig = useCallback((config: PaymentOnboardingConfig) => {
    const errors: string[] = [];

    if (config.enablePayments) {
      if (!config.subscriptionPlan) {
        errors.push("Please select a subscription plan");
      }

      if (!config.paymentMethods.creditCard && !config.paymentMethods.bankTransfer) {
        errors.push("Please enable at least one payment method");
      }

      if (config.pricing.consultationFee && parseFloat(config.pricing.consultationFee) <= 0) {
        errors.push("Consultation fee must be greater than 0");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    savePaymentConfig,
    validatePaymentConfig,
    isLoading
  };
};
