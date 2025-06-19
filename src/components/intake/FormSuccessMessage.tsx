
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const FormSuccessMessage: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for completing your intake form. We'll review your information and contact you soon.
        </p>
        <p className="text-sm text-gray-500">
          A confirmation has been sent to your email address.
        </p>
      </CardContent>
    </Card>
  );
};
