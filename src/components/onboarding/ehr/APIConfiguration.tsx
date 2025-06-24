
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EHRSystem } from './types';

interface APIConfigurationProps {
  apiCredentials: {
    endpoint: string;
    apiKey: string;
    clientId: string;
  };
  onCredentialChange: (field: string, value: string) => void;
  selectedEHR: EHRSystem | undefined;
}

export const APIConfiguration: React.FC<APIConfigurationProps> = ({
  apiCredentials,
  onCredentialChange,
  selectedEHR
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Enter your {selectedEHR?.name} API credentials. These will be securely stored and encrypted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="endpoint">API Endpoint</Label>
          <Input
            id="endpoint"
            placeholder="https://api.yourehr.com/v1"
            value={apiCredentials.endpoint}
            onChange={(e) => onCredentialChange('endpoint', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            placeholder="your-client-id"
            value={apiCredentials.clientId}
            onChange={(e) => onCredentialChange('clientId', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="your-api-key"
            value={apiCredentials.apiKey}
            onChange={(e) => onCredentialChange('apiKey', e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};
