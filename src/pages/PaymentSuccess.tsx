import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, FileText } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, you'd verify the payment with Stripe
      // For now, we'll show a success message
      setPaymentDetails({
        sessionId,
        amount: '$15.00',
        status: 'paid'
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p>Your payment has been processed successfully.</p>
            {paymentDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm"><strong>Session ID:</strong> {paymentDetails.sessionId}</p>
                <p className="text-sm"><strong>Amount:</strong> {paymentDetails.amount}</p>
                <p className="text-sm"><strong>Status:</strong> <span className="text-green-600 font-medium">Paid</span></p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.print()} 
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}