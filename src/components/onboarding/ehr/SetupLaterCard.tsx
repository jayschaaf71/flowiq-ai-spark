
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink } from "lucide-react";

export const SetupLaterCard: React.FC = () => {
  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-900">Setup Later</h4>
        </div>
        <p className="text-sm text-yellow-800 mb-4">
          Don't worry if you don't have your EHR credentials ready. You can complete this integration after finishing the onboarding process.
        </p>
        <Button variant="outline" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          Skip for Now
        </Button>
      </CardContent>
    </Card>
  );
};
