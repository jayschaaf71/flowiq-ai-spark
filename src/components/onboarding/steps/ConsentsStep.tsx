import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '@/hooks/usePatientOnboarding';
import { Shield, FileText, Phone, Mail, DollarSign } from 'lucide-react';

interface ConsentsStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  specialty?: string;
}

export const ConsentsStep: React.FC<ConsentsStepProps> = ({
  data,
  onUpdate,
  specialty
}) => {
  const consents = data.consents || {};

  const handleConsentChange = (field: string, checked: boolean) => {
    onUpdate({
      consents: {
        ...consents,
        [field]: checked
      }
    });
  };

  const requiredConsents = [
    {
      id: 'hipaaNotice',
      title: 'HIPAA Notice of Privacy Practices',
      description: 'I acknowledge receipt of the Notice of Privacy Practices',
      icon: Shield,
      required: true,
      content: 'This notice describes how medical information about you may be used and disclosed and how you can get access to this information.'
    },
    {
      id: 'treatmentConsent',
      title: 'Consent for Treatment',
      description: 'I consent to treatment by the healthcare providers',
      icon: FileText,
      required: true,
      content: 'I consent to the performance of healthcare services, including diagnostic procedures and medical treatment.'
    },
    {
      id: 'financialAgreement',
      title: 'Financial Agreement',
      description: 'I understand the financial policies and payment terms',
      icon: DollarSign,
      required: true,
      content: 'I understand and agree to the financial policies, including payment terms, insurance billing, and collection procedures.'
    }
  ];

  const optionalConsents = [
    {
      id: 'communicationConsent',
      title: 'Communication Consent',
      description: 'I consent to receive healthcare communications via phone, email, and text',
      icon: Phone,
      required: false,
      content: 'I consent to receive appointment reminders, health information, and other healthcare communications.'
    },
    {
      id: 'appointmentReminders',
      title: 'Appointment Reminders',
      description: 'I want to receive appointment reminders',
      icon: Mail,
      required: false,
      content: 'Receive reminders about upcoming appointments via your preferred communication method.'
    },
    {
      id: 'marketingCommunication',
      title: 'Marketing Communications',
      description: 'I consent to receive marketing and promotional materials',
      icon: Mail,
      required: false,
      content: 'Receive information about new services, health tips, and promotional offers.'
    }
  ];

  const allRequiredConsentsChecked = requiredConsents.every(consent => 
    (consents as any)[consent.id] === true
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Consents & Agreements</h3>
        <p className="text-gray-600">
          Please review and acknowledge the following agreements
        </p>
      </div>

      {/* Required Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700">Required Agreements</CardTitle>
          <CardDescription>
            These agreements are required to proceed with your healthcare services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {requiredConsents.map((consent) => {
            const IconComponent = consent.icon;
            return (
              <div key={consent.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={consent.id}
                    checked={(consents as any)[consent.id] || false}
                    onCheckedChange={(checked) => handleConsentChange(consent.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="w-4 h-4 text-red-600" />
                      <Label 
                        htmlFor={consent.id}
                        className="text-sm font-medium text-red-700 cursor-pointer"
                      >
                        {consent.title} *
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{consent.description}</p>
                    <p className="text-xs text-gray-500">{consent.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Optional Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Optional Preferences</CardTitle>
          <CardDescription>
            These preferences can be changed at any time in your portal settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {optionalConsents.map((consent) => {
            const IconComponent = consent.icon;
            return (
              <div key={consent.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={consent.id}
                    checked={(consents as any)[consent.id] || false}
                    onCheckedChange={(checked) => handleConsentChange(consent.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                      <Label 
                        htmlFor={consent.id}
                        className="text-sm font-medium text-blue-700 cursor-pointer"
                      >
                        {consent.title}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{consent.description}</p>
                    <p className="text-xs text-gray-500">{consent.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Specialty-specific consents */}
      {specialty === 'chiropractic' && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">Chiropractic Care Consent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="chiropracticConsent"
                checked={(consents as any).chiropracticConsent || false}
                onCheckedChange={(checked) => handleConsentChange('chiropracticConsent', checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label 
                  htmlFor="chiropracticConsent"
                  className="text-sm font-medium text-orange-700 cursor-pointer"
                >
                  Consent for Chiropractic Treatment
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  I understand the nature of chiropractic treatment and consent to chiropractic care including 
                  examination, treatment, and diagnostic procedures. I acknowledge that no guarantee of cure 
                  or improvement has been made.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Alert */}
      {!allRequiredConsentsChecked && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            <strong>Required:</strong> All required agreements must be acknowledged to continue with onboarding.
          </p>
        </div>
      )}

      {allRequiredConsentsChecked && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <strong>Thank you!</strong> All required agreements have been acknowledged.
          </p>
        </div>
      )}
    </div>
  );
};