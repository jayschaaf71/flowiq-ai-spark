
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Settings
} from "lucide-react";
import { SetupData } from "@/pages/PracticeSetup";

interface ReviewStepProps {
  setupData: SetupData;
  onComplete: () => void;
}

const practiceTypeNames = {
  'dental': 'Dental Clinic',
  'orthodontics': 'Orthodontics Practice',
  'oral-surgery': 'Oral Surgery Center',
  'chiropractic': 'Chiropractic Clinic',
  'physical-therapy': 'Physical Therapy',
  'veterinary': 'Veterinary Clinic',
  'med-spa': 'Med Spa / Aesthetic'
};

const agentNames = {
  'schedule-iq': 'Schedule iQ',
  'intake-iq': 'Intake iQ',
  'remind-iq': 'Remind iQ',
  'billing-iq': 'Billing iQ',
  'claims-iq': 'Claims iQ',
  'assist-iq': 'Assist iQ',
  'scribe-iq': 'Scribe iQ'
};

export const ReviewStep = ({ setupData, onComplete }: ReviewStepProps) => {
  const enabledIntegrations = Object.entries(setupData.integrations)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => key);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Review your setup</h2>
        <p className="text-gray-600">
          Please review your configuration before launching FlowIQ for your practice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Practice Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">Practice Type</p>
              <p className="text-sm text-gray-900">
                {setupData.practiceType ? practiceTypeNames[setupData.practiceType] : 'Not selected'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Practice Name</p>
              <p className="text-sm text-gray-900">{setupData.practiceName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-900">{setupData.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-900">{setupData.email}</p>
            </div>
            {setupData.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-900">{setupData.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected AI Agents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              AI Agents ({setupData.selectedAgents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {setupData.selectedAgents.length > 0 ? (
              <div className="space-y-2">
                {setupData.selectedAgents.map((agentId) => (
                  <div key={agentId} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">
                      {agentNames[agentId as keyof typeof agentNames]}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No agents selected</p>
            )}
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Integrations ({enabledIntegrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enabledIntegrations.length > 0 ? (
              <div className="space-y-2">
                {enabledIntegrations.map((integration) => (
                  <div key={integration} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 capitalize">
                      {integration === 'sms' ? 'SMS Messaging' : integration}
                    </span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      Enabled
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No integrations enabled</p>
            )}
          </CardContent>
        </Card>

        {/* What happens next */}
        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <p className="text-gray-700">Your AI agents will be activated and ready to use</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <p className="text-gray-700">You'll be redirected to your personalized dashboard</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <p className="text-gray-700">Complete integration setup for enabled services</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600">4</span>
                </div>
                <p className="text-gray-700">Start automating your practice workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to transform your practice?
          </h3>
          <p className="text-gray-700 mb-4">
            FlowIQ will start working immediately to automate your workflows and improve efficiency.
          </p>
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-2"
            size="lg"
          >
            Launch FlowIQ
          </Button>
        </div>
      </div>
    </div>
  );
};
