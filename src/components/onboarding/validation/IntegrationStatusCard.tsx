
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface IntegrationItem {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  config: any;
}

interface IntegrationStatusCardProps {
  item: IntegrationItem;
  result: any;
  isValidating: boolean;
}

export const IntegrationStatusCard: React.FC<IntegrationStatusCardProps> = ({
  item,
  result,
  isValidating
}) => {
  const Icon = item.icon;

  const getStatusIcon = (result: any) => {
    if (isValidating && !result) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!result) return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    return result.success 
      ? <CheckCircle2 className="w-4 h-4 text-green-600" />
      : <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (result: any) => {
    if (!result) return <Badge variant="secondary">Pending</Badge>;
    return result.success 
      ? <Badge className="bg-green-100 text-green-800">Connected</Badge>
      : <Badge variant="destructive">Failed</Badge>;
  };

  if (!item.enabled) {
    return (
      <Card className="opacity-60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-gray-400" />
              <CardTitle className="text-sm">{item.name}</CardTitle>
            </div>
            <Badge variant="outline">Disabled</Badge>
          </div>
          <CardDescription className="text-xs">{item.description}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`transition-colors ${
      result?.success ? 'border-green-200 bg-green-50' :
      result && !result.success ? 'border-red-200 bg-red-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            <CardTitle className="text-sm">{item.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(result)}
            {getStatusBadge(result)}
          </div>
        </div>
        <CardDescription className="text-xs">{item.description}</CardDescription>
      </CardHeader>
      
      {result && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <p className={`text-xs font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.message}
            </p>
            
            {result.details && (
              <div className="text-xs text-gray-600 space-y-1">
                {Object.entries(result.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-mono">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
