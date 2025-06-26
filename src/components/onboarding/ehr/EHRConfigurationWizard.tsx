
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle, 
  Database, 
  Key, 
  Shield, 
  Zap,
  ExternalLink,
  AlertCircle
} from "lucide-react";

interface EHRProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  setupSteps: string[];
  requiredFields: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    required: boolean;
    helpText?: string;
  }[];
}

interface EHRConfigurationWizardProps {
  provider: EHRProvider;
  onBack: () => void;
  onComplete: (config: any) => void;
  primaryColor: string;
}

export const EHRConfigurationWizard: React.FC<EHRConfigurationWizardProps> = ({
  provider,
  onBack,
  onComplete,
  primaryColor
}) => {
  const [currentTab, setCurrentTab] = useState('credentials');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [syncSettings, setSyncSettings] = useState({
    patientData: true,
    appointments: true,
    clinicalNotes: true,
    billing: false,
    realTimeSync: true
  });
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'untested' | 'success' | 'failed'>('untested');

  const handleCredentialChange = (fieldId: string, value: string) => {
    setCredentials(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus('success'); // In real app, this would be based on actual test results
    setIsTestingConnection(false);
  };

  const handleComplete = () => {
    const config = {
      provider: provider.id,
      credentials: credentials,
      syncSettings: syncSettings,
      connectionTested: connectionStatus === 'success'
    };
    onComplete(config);
  };

  const isConfigComplete = () => {
    const requiredFieldsFilled = provider.requiredFields
      .filter(field => field.required)
      .every(field => credentials[field.id]?.trim());
    return requiredFieldsFilled && connectionStatus === 'success';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{provider.logo}</span>
          <div>
            <h2 className="text-2xl font-bold">{provider.name} Integration Setup</h2>
            <p className="text-gray-600">Configure your {provider.name} connection</p>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="credentials" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data Sync
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Test & Complete
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Credentials</CardTitle>
              <CardDescription>
                Enter your {provider.name} API credentials to establish the connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider.requiredFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={credentials[field.id] || ''}
                    onChange={(e) => handleCredentialChange(field.id, e.target.value)}
                  />
                  {field.helpText && (
                    <p className="text-sm text-gray-600">{field.helpText}</p>
                  )}
                </div>
              ))}
              
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Security Note:</strong> All credentials are encrypted and stored securely. 
                  We use industry-standard encryption to protect your EHR access tokens.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Synchronization Settings</CardTitle>
              <CardDescription>
                Choose what data to sync between FlowIQ and {provider.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Patient Demographics</Label>
                    <p className="text-sm text-gray-600">Names, contact info, insurance details</p>
                  </div>
                  <Switch
                    checked={syncSettings.patientData}
                    onCheckedChange={(checked) => 
                      setSyncSettings(prev => ({ ...prev, patientData: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Appointments & Scheduling</Label>
                    <p className="text-sm text-gray-600">Appointment data and availability</p>
                  </div>
                  <Switch
                    checked={syncSettings.appointments}
                    onCheckedChange={(checked) => 
                      setSyncSettings(prev => ({ ...prev, appointments: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Clinical Notes</Label>
                    <p className="text-sm text-gray-600">SOAP notes, treatment plans, assessments</p>
                  </div>
                  <Switch
                    checked={syncSettings.clinicalNotes}
                    onCheckedChange={(checked) => 
                      setSyncSettings(prev => ({ ...prev, clinicalNotes: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Billing & Claims</Label>
                    <p className="text-sm text-gray-600">Insurance claims, payment information</p>
                  </div>
                  <Switch
                    checked={syncSettings.billing}
                    onCheckedChange={(checked) => 
                      setSyncSettings(prev => ({ ...prev, billing: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Real-time Sync</Label>
                    <p className="text-sm text-gray-600">Automatically sync changes as they happen</p>
                  </div>
                  <Switch
                    checked={syncSettings.realTimeSync}
                    onCheckedChange={(checked) => 
                      setSyncSettings(prev => ({ ...prev, realTimeSync: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Connection</CardTitle>
              <CardDescription>
                Verify your {provider.name} integration is working correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !provider.requiredFields.every(field => credentials[field.id])}
                  className="w-full"
                >
                  {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
                </Button>

                {connectionStatus === 'success' && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Connection Successful!</strong> Your {provider.name} integration is ready to use.
                    </AlertDescription>
                  </Alert>
                )}

                {connectionStatus === 'failed' && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Connection Failed.</strong> Please check your credentials and try again.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentTab('sync')}>
              Previous
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!isConfigComplete()}
              style={{ backgroundColor: isConfigComplete() ? primaryColor : undefined }}
            >
              Complete Integration
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
