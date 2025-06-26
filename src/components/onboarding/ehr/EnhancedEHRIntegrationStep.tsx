
import React, { useState } from 'react';
import { specialtyConfigs } from '@/utils/specialtyConfig';
import { EHRProviderCard } from './EHRProviderCard';
import { EHRConfigurationWizard } from './EHRConfigurationWizard';
import { EHRToggleCard } from './EHRToggleCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  CheckCircle, 
  Clock, 
  Users, 
  Building,
  Zap,
  Shield,
  ArrowRight
} from "lucide-react";

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

interface EnhancedEHRIntegrationStepProps {
  specialty: any;
  ehrConfig: {
    enableIntegration: boolean;
    selectedEHR: string;
    syncSettings: any;
    apiCredentials: any;
  };
  onUpdateEHRConfig: (config: any) => void;
}

export const EnhancedEHRIntegrationStep: React.FC<EnhancedEHRIntegrationStepProps> = ({ 
  specialty, 
  ehrConfig, 
  onUpdateEHRConfig 
}) => {
  const [currentView, setCurrentView] = useState<'overview' | 'providers' | 'configure'>('overview');
  const [selectedProvider, setSelectedProvider] = useState<EHRProvider | null>(null);
  
  const specialtyConfig = specialtyConfigs[specialty];

  const ehrProviders: EHRProvider[] = [
    {
      id: 'epic',
      name: 'Epic',
      logo: '🏥',
      description: 'Industry-leading EHR system used by major health systems worldwide',
      popularity: 'Most Popular',
      integration: 'Full API Support',
      features: ['FHIR R4 API', 'Patient Portal', 'Clinical Decision Support', 'Revenue Cycle'],
      setupComplexity: 'Medium',
      estimatedTime: '15-30 minutes',
      setupSteps: ['Register Epic App', 'Configure OAuth', 'Test Connection', 'Map Data Fields'],
      requiredFields: [
        { id: 'endpoint', label: 'Epic Endpoint URL', type: 'url', placeholder: 'https://fhir.epic.com/interconnect-fhir-oauth/', required: true, helpText: 'Your Epic FHIR endpoint URL' },
        { id: 'clientId', label: 'Client ID', type: 'text', placeholder: 'your-epic-client-id', required: true },
        { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'your-epic-client-secret', required: true }
      ]
    },
    {
      id: 'cerner',
      name: 'Cerner (Oracle Health)',
      logo: '⚡',
      description: 'Comprehensive healthcare technology platform with robust integration capabilities',
      popularity: 'Very Popular',
      integration: 'Full API Support',
      features: ['SMART on FHIR', 'Population Health', 'Clinical Surveillance', 'Interoperability'],
      setupComplexity: 'Medium',
      estimatedTime: '20-35 minutes',
      setupSteps: ['Register Cerner App', 'Configure SMART on FHIR', 'Set up Webhooks', 'Test Integration'],
      requiredFields: [
        { id: 'endpoint', label: 'Cerner FHIR URL', type: 'url', placeholder: 'https://fhir-open.cerner.com/r4/', required: true },
        { id: 'clientId', label: 'Application ID', type: 'text', placeholder: 'your-cerner-app-id', required: true },
        { id: 'clientSecret', label: 'Application Secret', type: 'password', placeholder: 'your-cerner-secret', required: true }
      ]
    },
    {
      id: 'athenahealth',
      name: 'athenahealth',
      logo: '🔬',
      description: 'Cloud-based practice management and EHR platform with strong API ecosystem',
      popularity: 'Popular',
      integration: 'Full API Support',
      features: ['Practice Management', 'Patient Engagement', 'Revenue Cycle', 'Population Health'],
      setupComplexity: 'Easy',
      estimatedTime: '10-20 minutes',
      setupSteps: ['Get API Key', 'Configure Endpoints', 'Set Permissions', 'Test Connection'],
      requiredFields: [
        { id: 'apiKey', label: 'API Key', type: 'password', placeholder: 'your-athena-api-key', required: true },
        { id: 'practiceId', label: 'Practice ID', type: 'text', placeholder: '12345', required: true },
        { id: 'version', label: 'API Version', type: 'text', placeholder: 'v1', required: true, helpText: 'Usually "v1" for most integrations' }
      ]
    },
    {
      id: 'drchrono',
      name: 'DrChrono',
      logo: '📱',
      description: 'Mobile-first EHR platform designed for modern medical practices',
      popularity: 'Growing',
      integration: 'Full API Support',
      features: ['Mobile EHR', 'iPad Interface', 'Patient Check-in', 'Billing Integration'],
      setupComplexity: 'Easy',
      estimatedTime: '10-15 minutes',
      setupSteps: ['Create DrChrono App', 'OAuth Setup', 'Permission Configuration', 'Test API'],
      requiredFields: [
        { id: 'clientId', label: 'Client ID', type: 'text', placeholder: 'your-drchrono-client-id', required: true },
        { id: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'your-drchrono-secret', required: true },
        { id: 'redirectUri', label: 'Redirect URI', type: 'url', placeholder: 'https://your-app.com/oauth/callback', required: true }
      ]
    },
    {
      id: 'allscripts',
      name: 'Allscripts',
      logo: '📋',
      description: 'Comprehensive healthcare IT solutions with strong interoperability features',
      popularity: 'Established',
      integration: 'API Available',
      features: ['Clinical Documentation', 'Population Health', 'Precision Medicine', 'Interoperability'],
      setupComplexity: 'Advanced',
      estimatedTime: '30-45 minutes',
      setupSteps: ['Partner Registration', 'Technical Review', 'Certification', 'Go-Live Testing'],
      requiredFields: [
        { id: 'appName', label: 'Application Name', type: 'text', placeholder: 'FlowIQ Integration', required: true },
        { id: 'username', label: 'API Username', type: 'text', placeholder: 'api-username', required: true },
        { id: 'password', label: 'API Password', type: 'password', placeholder: 'api-password', required: true },
        { id: 'appToken', label: 'Application Token', type: 'password', placeholder: 'app-token', required: true }
      ]
    },
    {
      id: 'nextgen',
      name: 'NextGen Healthcare',
      logo: '🚀',
      description: 'Ambulatory EHR and practice management solutions for specialty practices',
      popularity: 'Specialty Focused',
      integration: 'API Available',
      features: ['Ambulatory EHR', 'Practice Management', 'Patient Portal', 'Quality Reporting'],
      setupComplexity: 'Medium',
      estimatedTime: '20-30 minutes',
      setupSteps: ['API Registration', 'Security Configuration', 'Data Mapping', 'Integration Testing'],
      requiredFields: [
        { id: 'serverUrl', label: 'NextGen Server URL', type: 'url', placeholder: 'https://your-nextgen-server.com', required: true },
        { id: 'username', label: 'Username', type: 'text', placeholder: 'integration-user', required: true },
        { id: 'password', label: 'Password', type: 'password', placeholder: 'secure-password', required: true },
        { id: 'enterpriseId', label: 'Enterprise ID', type: 'text', placeholder: 'enterprise-123', required: true }
      ]
    }
  ];

  const benefits = [
    {
      icon: Database,
      title: "Unified Patient Records",
      description: "Access complete patient history across all systems"
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Automatic data synchronization between platforms"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and compliance"
    },
    {
      icon: Users,
      title: "Improved Workflow",
      description: "Streamlined processes for better patient care"
    }
  ];

  const handleToggleIntegration = (enabled: boolean) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      enableIntegration: enabled
    });
    
    if (enabled) {
      setCurrentView('providers');
    } else {
      setCurrentView('overview');
    }
  };

  const handleProviderSelect = (providerId: string) => {
    const provider = ehrProviders.find(p => p.id === providerId);
    if (provider) {
      onUpdateEHRConfig({
        ...ehrConfig,
        selectedEHR: providerId
      });
    }
  };

  const handleConfigureProvider = (providerId: string) => {
    const provider = ehrProviders.find(p => p.id === providerId);
    if (provider) {
      setSelectedProvider(provider);
      setCurrentView('configure');
    }
  };

  const handleConfigurationComplete = (config: any) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      ...config,
      configured: true
    });
    setCurrentView('providers');
    setSelectedProvider(null);
  };

  if (currentView === 'configure' && selectedProvider) {
    return (
      <EHRConfigurationWizard
        provider={selectedProvider}
        onBack={() => setCurrentView('providers')}
        onComplete={handleConfigurationComplete}
        primaryColor={specialtyConfig.primaryColor}
      />
    );
  }

  if (currentView === 'providers') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Select Your EHR System</h2>
            <p className="text-gray-600 text-lg">
              Choose your Electronic Health Record system to integrate with FlowIQ
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('overview')}>
            Back to Overview
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ehrProviders.map((provider) => (
            <EHRProviderCard
              key={provider.id}
              provider={provider}
              isSelected={ehrConfig.selectedEHR === provider.id}
              onSelect={handleProviderSelect}
              onConfigure={handleConfigureProvider}
              primaryColor={specialtyConfig.primaryColor}
            />
          ))}
        </div>

        {ehrConfig.selectedEHR && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>EHR System Selected:</strong> {ehrProviders.find(p => p.id === ehrConfig.selectedEHR)?.name} 
              is ready for configuration. Click the settings button to set up your integration.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">EHR Integration</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Connect FlowIQ with your existing Electronic Health Record system to streamline your {specialtyConfig.brandName.toLowerCase()} practice workflow and eliminate duplicate data entry.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <div key={index} className="text-center p-4 border rounded-lg">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          );
        })}
      </div>

      <EHRToggleCard
        enableIntegration={ehrConfig.enableIntegration}
        onToggle={handleToggleIntegration}
        primaryColor={specialtyConfig.primaryColor}
        brandName={specialtyConfig.brandName}
      />

      {!ehrConfig.enableIntegration && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Set Up Later
            </CardTitle>
            <CardDescription>
              You can always configure EHR integration later from your settings dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Building className="h-4 w-4" />
              <AlertDescription>
                <strong>No worries!</strong> You can continue with the onboarding process and set up 
                EHR integration when you're ready. All your data will be safely stored and can be 
                synchronized once you configure your EHR connection.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {ehrConfig.enableIntegration && (
        <div className="text-center">
          <Button 
            onClick={() => setCurrentView('providers')}
            size="lg"
            style={{ backgroundColor: specialtyConfig.primaryColor }}
          >
            Choose Your EHR System
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};
