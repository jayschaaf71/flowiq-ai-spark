
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MessageSquare, 
  Mail, 
  CreditCard,
  ExternalLink
} from "lucide-react";
import { SetupData } from "@/pages/PracticeSetup";

interface IntegrationStepProps {
  setupData: SetupData;
  updateSetupData: (updates: Partial<SetupData>) => void;
}

const integrations = [
  {
    id: 'calendar' as keyof SetupData['integrations'],
    name: 'Calendar Integration',
    description: 'Connect with Google Calendar, Outlook, or Apple Calendar',
    icon: Calendar,
    benefits: ['Sync appointments automatically', 'Prevent double bookings', 'Real-time availability'],
    required: false,
    popular: true
  },
  {
    id: 'sms' as keyof SetupData['integrations'],
    name: 'SMS Messaging',
    description: 'Send appointment reminders and updates via text message',
    icon: MessageSquare,
    benefits: ['Higher open rates than email', 'Instant delivery', 'Two-way communication'],
    required: false,
    popular: true
  },
  {
    id: 'email' as keyof SetupData['integrations'],
    name: 'Email Communication',
    description: 'Automated email workflows for appointments and follow-ups',
    icon: Mail,
    benefits: ['Professional communication', 'Rich formatting options', 'Attachment support'],
    required: false,
    popular: true
  },
  {
    id: 'payments' as keyof SetupData['integrations'],
    name: 'Payment Processing',
    description: 'Accept online payments and set up payment plans',
    icon: CreditCard,
    benefits: ['Faster payments', 'Reduced administrative work', 'Payment plan automation'],
    required: false,
    popular: false
  }
];

export const IntegrationStep = ({ setupData, updateSetupData }: IntegrationStepProps) => {
  const handleIntegrationToggle = (integrationId: keyof SetupData['integrations']) => {
    const currentIntegrations = setupData.integrations;
    const updatedIntegrations = {
      ...currentIntegrations,
      [integrationId]: !currentIntegrations[integrationId]
    };
    updateSetupData({ integrations: updatedIntegrations });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Connect your tools</h2>
        <p className="text-gray-600">
          Enable integrations to enhance your AI agents' capabilities. These are optional and can be set up later.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isEnabled = setupData.integrations[integration.id];
          
          return (
            <Card key={integration.id} className="relative">
              {integration.popular && (
                <Badge className="absolute -top-2 -right-2 bg-blue-500">
                  Popular
                </Badge>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isEnabled ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleIntegrationToggle(integration.id)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-1 mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Benefits:</p>
                  {integration.benefits.map((benefit, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {benefit}
                    </div>
                  ))}
                </div>
                
                {isEnabled && (
                  <div className="text-xs text-blue-600 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Configure after setup completion
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-medium text-gray-900 mb-2">Don't worry about setup complexity</h3>
        <p className="text-sm text-gray-700">
          Our setup wizard will guide you through each integration step-by-step after you complete the initial setup. 
          You can also contact our support team for hands-on assistance.
        </p>
      </div>
    </div>
  );
};
