
import React from 'react';
import { Shield, Loader2 } from 'lucide-react';

interface AuthLoadingStateProps {
  message?: string;
}

export const AuthLoadingState: React.FC<AuthLoadingStateProps> = ({ 
  message = "Verifying secure access..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <Shield className="h-12 w-12 text-blue-600 mx-auto" />
          <Loader2 className="h-4 w-4 animate-spin text-blue-400 absolute top-0 right-0" />
        </div>
        <div className="text-lg font-medium text-gray-900">{message}</div>
        <div className="text-sm text-gray-600">Please wait while we authenticate your session</div>
      </div>
    </div>
  );
};
