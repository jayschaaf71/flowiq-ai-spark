
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const PaymentSecurityNotice: React.FC = () => {
  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Shield className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Security & Compliance:</strong> All payment processing is PCI DSS compliant and HIPAA secure. 
        Patient payment data is encrypted end-to-end and never stored on your servers.
      </AlertDescription>
    </Alert>
  );
};
