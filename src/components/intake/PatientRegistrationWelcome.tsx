
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, ArrowRight } from 'lucide-react';
import { useTenantConfig } from '@/utils/tenantConfig';
import { IntakeForm } from '@/hooks/useIntakeForms';

interface PatientRegistrationWelcomeProps {
  newPatientForm: IntakeForm | undefined;
  pregnancyForm: IntakeForm | undefined;
  menstrualForm: IntakeForm | undefined;
  forms: IntakeForm[];
  onStartIntake: () => void;
  isInitializing?: boolean;
}

export const PatientRegistrationWelcome: React.FC<PatientRegistrationWelcomeProps> = ({
  newPatientForm,
  pregnancyForm,
  menstrualForm,
  forms,
  onStartIntake
}) => {
  const tenantConfig = useTenantConfig();

  if (!newPatientForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={`text-${tenantConfig.primaryColor}-600`}>
            Patient Registration Portal
          </CardTitle>
          <CardDescription>
            Complete your intake process starting with basic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className={`w-16 h-16 mx-auto mb-4 text-${tenantConfig.primaryColor}-600 opacity-50`} />
            <h3 className="text-lg font-medium mb-2">No Intake Forms Available</h3>
            <p className="text-gray-600 mb-4">
              The New Patient Intake Form is required to start the registration process.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`text-${tenantConfig.primaryColor}-600`}>
            Patient Registration Portal
          </CardTitle>
          <CardDescription>
            Complete your intake process starting with basic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Welcome to {tenantConfig.name}</h3>
              <p className="text-gray-600 mb-6">
                We'll guide you through a few forms to get your information. The process starts with basic patient information, 
                and then we may ask additional questions based on your responses.
              </p>
            </div>

            {/* Process Overview */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">What to Expect:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <span>New Patient Information (Required)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <span>Additional forms based on your information (if applicable)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={onStartIntake}
                className={`bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                size="lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Start Patient Intake
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Forms Preview */}
      {forms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Forms</CardTitle>
            <CardDescription>Forms that may be included in your intake process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {[newPatientForm, pregnancyForm, menstrualForm].filter(Boolean).map((form) => (
                <div
                  key={form!.id}
                  className="border rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium">{form!.title}</h4>
                    {form!.description && (
                      <p className="text-sm text-gray-600 mt-1">{form!.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={form!.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                    >
                      {form!.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {Array.isArray(form!.form_fields) ? form!.form_fields.length : 0} fields
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
