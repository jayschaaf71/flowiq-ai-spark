
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface ValidationProgressCardProps {
  isValidating: boolean;
  validationProgress: number;
}

export const ValidationProgressCard: React.FC<ValidationProgressCardProps> = ({
  isValidating,
  validationProgress
}) => {
  if (!isValidating) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Validating integrations...</p>
            <Progress value={validationProgress} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
