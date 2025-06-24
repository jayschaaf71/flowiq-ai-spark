
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  Zap, 
  Calendar, 
  Users,
  FileText,
  Settings,
  CheckCircle,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface EHRIntegrationStepProps {
  specialty: SpecialtyType;
  ehrConfig: {
    enableIntegration: boolean;
    selectedEHR: string;
    syncSettings: {
      patientData: boolean;
      appointments: boolean;
      clinicalNotes: boolean;
      billing: boolean;
    };
    apiCredentials: {
      endpoint: string;
      apiKey: string;
      clientId: string;
    };
  };
  onUpdateEHRConfig: (config: any) => void;
}

export const EHRIntegrationStep = ({ 
  specialty, 
  ehrConfig, 
  onUpdateEHRConfig 
}: EHRIntegrationStepProps) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const ehrSystems = [
    {
      id: 'epic',
      name: 'Epic',
      logo: '🏥',
      description: 'Leading EHR system for large practices',
      popularity: 'Very Popular',
      integration: 'Full API Support'
    },
    {
      id: 'cerner',
      name: 'Cerner (Oracle Health)',
      logo: '⚡',
      description: 'Comprehensive healthcare technology',
      popularity: 'Popular',
      integration: 'Full API Support'
    },
    {
      id: 'athenahealth',
      name: 'athenahealth',
      logo: '🔬',
      description: 'Cloud-based practice management',
      popularity: 'Popular',
      integration: 'Full API Support'
    },
    {
      id: 'drchrono',
      name: 'DrChrono',
      logo: '📱',
      description: 'Mobile-first EHR platform',
      popularity: 'Growing',
      integration: 'Full API Support'
    },
    {
      id: 'practice_fusion',
      name: 'Practice Fusion',
      logo: '🌐',
      description: 'Free cloud-based EHR',
      popularity: 'Popular',
      integration: 'Limited API'
    },
    {
      id: 'other',
      name: 'Other/Custom',
      logo: '⚙️',
      description: 'Custom integration setup',
      popularity: 'Custom',
      integration: 'Custom Setup'
    }
  ];

  const handleIntegrationToggle = (enabled: boolean) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      enableIntegration: enabled
    });
  };

  const handleEHRSelect = (ehrId: string) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      selectedEHR: ehrId
    });
  };

  const handleSyncToggle = (setting: string, enabled: boolean) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      syncSettings: {
        ...ehrConfig.syncSettings,
        [setting]: enabled
      }
    });
  };

  const handleCredentialChange = (field: string, value: string) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      apiCredentials: {
        ...ehrConfig.apiCredentials,
        [field]: value
      }
    });
  };

  const selectedEHR = ehrSystems.find(ehr => ehr.id === ehrConfig.selectedEHR);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">EHR Integration</h2>
        <p className="text-gray-600 text-lg">
          Connect FlowIQ with your existing Electronic Health Record system to streamline your {specialtyConfig.brandName.toLowerCase()} practice workflow.
        </p>
      </div>

      {/* Enable Integration */}
      <Card className="border-2" style={{ borderColor: specialtyConfig.primaryColor + '20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            EHR Integration
          </CardTitle>
          <CardDescription>
            Seamlessly sync patient data, appointments, and clinical notes with your existing EHR system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable EHR Integration</Label>
              <p className="text-sm text-gray-600">Connect with your practice management system</p>
            </div>
            <Switch
              checked={ehrConfig.enableIntegration}
              onCheckedChange={handleIntegrationToggle}
            />
          </div>
        </CardContent>
      </Card>

      {ehrConfig.enableIntegration && (
        <>
          {/* EHR System Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
                Select Your EHR System
              </CardTitle>
              <CardDescription>
                Choose your current Electronic Health Record system for integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ehrSystems.map((ehr) => (
                  <Card 
                    key={ehr.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      ehrConfig.selectedEHR === ehr.id
                        ? 'shadow-lg' 
                        : 'border hover:border-gray-300'
                    }`}
                    style={{
                      borderWidth: ehrConfig.selectedEHR === ehr.id ? '2px' : '1px',
                      borderColor: ehrConfig.selectedEHR === ehr.id ? specialtyConfig.primaryColor : undefined,
                      backgroundColor: ehrConfig.selectedEHR === ehr.id ? specialtyConfig.primaryColor + '05' : undefined
                    }}
                    onClick={() => handleEHRSelect(ehr.id)}
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
                          borderColor: specialtyConfig.primaryColor,
                          color: specialtyConfig.primaryColor 
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

          {/* Data Sync Settings */}
          {ehrConfig.selectedEHR && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
                  Data Synchronization
                </CardTitle>
                <CardDescription>
                  Choose what data to sync between FlowIQ and {selectedEHR?.name}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <div>
                      <Label>Patient Demographics</Label>
                      <p className="text-sm text-gray-600">Name, contact info, insurance</p>
                    </div>
                  </div>
                  <Switch
                    checked={ehrConfig.syncSettings.patientData}
                    onCheckedChange={(checked) => handleSyncToggle('patientData', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <Label>Appointments & Scheduling</Label>
                      <p className="text-sm text-gray-600">Sync appointment data</p>
                    </div>
                  </div>
                  <Switch
                    checked={ehrConfig.syncSettings.appointments}
                    onCheckedChange={(checked) => handleSyncToggle('appointments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <div>
                      <Label>Clinical Notes & Documentation</Label>
                      <p className="text-sm text-gray-600">SOAP notes, treatment plans</p>
                    </div>
                  </div>
                  <Switch
                    checked={ehrConfig.syncSettings.clinicalNotes}
                    onCheckedChange={(checked) => handleSyncToggle('clinicalNotes', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <div>
                      <Label>Billing & Claims</Label>
                      <p className="text-sm text-gray-600">Insurance claims, payments</p>
                    </div>
                  </div>
                  <Switch
                    checked={ehrConfig.syncSettings.billing}
                    onCheckedChange={(checked) => handleSyncToggle('billing', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Configuration */}
          {ehrConfig.selectedEHR && ehrConfig.selectedEHR !== 'other' && (
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
                    value={ehrConfig.apiCredentials.endpoint}
                    onChange={(e) => handleCredentialChange('endpoint', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input
                    id="clientId"
                    placeholder="your-client-id"
                    value={ehrConfig.apiCredentials.clientId}
                    onChange={(e) => handleCredentialChange('clientId', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="your-api-key"
                    value={ehrConfig.apiCredentials.apiKey}
                    onChange={(e) => handleCredentialChange('apiKey', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Later Option */}
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
                View Integration Guide
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
