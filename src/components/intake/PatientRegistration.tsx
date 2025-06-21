
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useTenantConfig } from '@/utils/tenantConfig';
import { PatientFormRenderer } from './PatientFormRenderer';

export const PatientRegistration: React.FC = () => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [completedForms, setCompletedForms] = useState<string[]>([]);
  const [patientGender, setPatientGender] = useState<string>('');
  const [formSequence, setFormSequence] = useState<string[]>([]);
  
  const { forms, loading } = useIntakeForms();
  const tenantConfig = useTenantConfig();

  // Get forms in specific order
  const newPatientForm = forms.find(form => form.title.toLowerCase().includes('new patient'));
  const pregnancyForm = forms.find(form => form.title.toLowerCase().includes('pregnancy'));
  const menstrualForm = forms.find(form => form.title.toLowerCase().includes('menstrual'));

  const currentForm = formSequence.length > 0 ? forms.find(form => form.id === formSequence[currentFormIndex]) : null;

  const initializeFormSequence = () => {
    const sequence = [];
    
    // Always start with new patient intake
    if (newPatientForm) {
      sequence.push(newPatientForm.id);
    }
    
    setFormSequence(sequence);
    setCurrentFormIndex(0);
    setShowForm(true);
  };

  const handleFormSubmissionComplete = (submission: any) => {
    console.log('Form submitted successfully:', submission);
    
    const currentFormId = formSequence[currentFormIndex];
    setCompletedForms(prev => [...prev, currentFormId]);

    // Check if this was the new patient form and extract gender
    if (currentForm?.title.toLowerCase().includes('new patient')) {
      const gender = submission.form_data?.gender || submission.formData?.gender;
      setPatientGender(gender);
      
      // Add conditional forms based on gender
      if (gender?.toLowerCase() === 'female') {
        const updatedSequence = [...formSequence];
        if (pregnancyForm && !updatedSequence.includes(pregnancyForm.id)) {
          updatedSequence.push(pregnancyForm.id);
        }
        if (menstrualForm && !updatedSequence.includes(menstrualForm.id)) {
          updatedSequence.push(menstrualForm.id);
        }
        setFormSequence(updatedSequence);
      }
    }

    // Move to next form or complete the process
    if (currentFormIndex < formSequence.length - 1) {
      setCurrentFormIndex(prev => prev + 1);
    } else {
      // All forms completed
      setShowForm(false);
      setCurrentFormIndex(0);
    }
  };

  const handleSkipForm = () => {
    if (currentFormIndex < formSequence.length - 1) {
      setCurrentFormIndex(prev => prev + 1);
    } else {
      setShowForm(false);
      setCurrentFormIndex(0);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm && currentForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">Patient Intake Process</h2>
                <p className="text-sm text-gray-600">
                  Step {currentFormIndex + 1} of {formSequence.length}: {currentForm.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-500">
                      {Math.round(((currentFormIndex + 1) / formSequence.length) * 100)}% Complete
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {currentFormIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleSkipForm}
                    size="sm"
                  >
                    Skip This Form
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Exit Process
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PatientFormRenderer
          form={currentForm}
          onSubmissionComplete={handleFormSubmissionComplete}
        />
      </div>
    );
  }

  // Show completion screen if forms are completed
  if (completedForms.length > 0 && !showForm) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-semibold mb-2">Intake Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing your intake forms. Your information has been submitted successfully.
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm font-medium">Completed Forms:</p>
              {completedForms.map(formId => {
                const form = forms.find(f => f.id === formId);
                return form ? (
                  <div key={formId} className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{form.title}</span>
                  </div>
                ) : null;
              })}
            </div>
            <Button
              onClick={() => {
                setCompletedForms([]);
                setPatientGender('');
                setFormSequence([]);
                setCurrentFormIndex(0);
              }}
              variant="outline"
            >
              Start New Intake
            </Button>
          </CardContent>
        </Card>
      </div>
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
          {!newPatientForm ? (
            <div className="text-center py-12">
              <FileText className={`w-16 h-16 mx-auto mb-4 text-${tenantConfig.primaryColor}-600 opacity-50`} />
              <h3 className="text-lg font-medium mb-2">No Intake Forms Available</h3>
              <p className="text-gray-600 mb-4">
                The New Patient Intake Form is required to start the registration process.
              </p>
            </div>
          ) : (
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
                  onClick={initializeFormSequence}
                  className={`bg-${tenantConfig.primaryColor}-600 hover:bg-${tenantConfig.primaryColor}-700`}
                  size="lg"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Start Patient Intake
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
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
