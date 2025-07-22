import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCanceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-muted-foreground">
            <p>Your payment was canceled. No charges have been made to your account.</p>
            <p className="mt-2 text-sm">If you encountered any issues, please contact our support team.</p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)} 
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}