
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Settings } from "lucide-react";

interface EHRProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  popularity: string;
  integration: string;
  features: string[];
  setupComplexity: 'Easy' | 'Medium' | 'Advanced';
  estimatedTime: string;
}

interface EHRProviderCardProps {
  provider: EHRProvider;
  isSelected: boolean;
  onSelect: (providerId: string) => void;
  onConfigure: (providerId: string) => void;
  primaryColor: string;
}

export const EHRProviderCard: React.FC<EHRProviderCardProps> = ({
  provider,
  isSelected,
  onSelect,
  onConfigure,
  primaryColor
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? 'shadow-lg border-2' 
          : 'border hover:border-gray-300'
      }`}
      style={{
        borderColor: isSelected ? primaryColor : undefined,
        backgroundColor: isSelected ? primaryColor + '05' : undefined
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{provider.logo}</span>
            <div>
              <CardTitle className="text-lg">{provider.name}</CardTitle>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {provider.popularity}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    provider.setupComplexity === 'Easy' ? 'border-green-500 text-green-700' :
                    provider.setupComplexity === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                    'border-red-500 text-red-700'
                  }`}
                >
                  {provider.setupComplexity} Setup
                </Badge>
              </div>
            </div>
          </div>
          
          {isSelected && (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <CardDescription className="mb-3">
          {provider.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">Key Features:</p>
            <div className="flex flex-wrap gap-1">
              {provider.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {provider.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{provider.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Setup time: {provider.estimatedTime}</span>
            <Badge 
              variant="outline" 
              style={{ 
                borderColor: primaryColor,
                color: primaryColor 
              }}
            >
              {provider.integration}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button
            variant={isSelected ? "default" : "outline"}
            onClick={() => onSelect(provider.id)}
            className="flex-1"
            style={isSelected ? { backgroundColor: primaryColor } : {}}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
          
          {isSelected && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(provider.id)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
