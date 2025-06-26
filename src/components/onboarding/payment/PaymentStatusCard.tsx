
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CreditCard, Check, Shield, ArrowRight } from 'lucide-react';

interface PaymentStatusCardProps {
  paymentConfig: {
    enablePayments: boolean;
    subscriptionPlan: string;
  };
  onTogglePayments: (enabled: boolean) => void;
  onShowConfiguration: () => void;
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  paymentConfig,
  onTogglePayments,
  onShowConfiguration
}) => {
  return (
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
            onCheckedChange={onTogglePayments}
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
              <Button onClick={onShowConfiguration}>
                Configure Payment Settings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
