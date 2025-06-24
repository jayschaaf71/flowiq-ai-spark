
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export const NoIntegrationsCard: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="text-gray-500 mb-4">
          <ExternalLink className="w-12 h-12 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">No Integrations Enabled</h3>
          <p className="text-sm">
            You haven't enabled any integrations that require validation. 
            You can skip this step or go back to enable integrations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
