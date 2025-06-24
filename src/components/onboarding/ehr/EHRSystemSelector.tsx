
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { EHRSystem } from './types';

interface EHRSystemSelectorProps {
  systems: EHRSystem[];
  selectedEHR: string;
  onSelect: (ehrId: string) => void;
  primaryColor: string;
}

export const EHRSystemSelector: React.FC<EHRSystemSelectorProps> = ({
  systems,
  selectedEHR,
  onSelect,
  primaryColor
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" style={{ color: primaryColor }} />
          Select Your EHR System
        </CardTitle>
        <CardDescription>
          Choose your current Electronic Health Record system for integration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((ehr) => (
            <Card 
              key={ehr.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedEHR === ehr.id
                  ? 'shadow-lg' 
                  : 'border hover:border-gray-300'
              }`}
              style={{
                borderWidth: selectedEHR === ehr.id ? '2px' : '1px',
                borderColor: selectedEHR === ehr.id ? primaryColor : undefined,
                backgroundColor: selectedEHR === ehr.id ? primaryColor + '05' : undefined
              }}
              onClick={() => onSelect(ehr.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ehr.logo}</span>
                  <div>
                    <CardTitle className="text-base">{ehr.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {ehr.popularity}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{ehr.description}</p>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor 
                  }}
                >
                  {ehr.integration}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
