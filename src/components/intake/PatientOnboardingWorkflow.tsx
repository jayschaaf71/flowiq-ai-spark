
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, AlertCircle } from "lucide-react";
import { PatientData, PatientOnboardingWorkflowProps } from "@/types/patient-onboarding";
import { validatePatientStep } from "@/utils/patient-onboarding-validation";
import { submitPatientOnboardingData } from "@/services/patient-onboarding-service";
import { PersonalInformationStep } from "./steps/PersonalInformationStep";
import { AddressEmergencyStep } from "./steps/AddressEmergencyStep";
import { InsuranceStep } from "./steps/InsuranceStep";
import { MedicalHistoryStep } from "./steps/MedicalHistoryStep";
import { ConsentStep } from "./steps/ConsentStep";

export const PatientOnboardingWorkflow = ({ onComplete, onCancel }: PatientOnboardingWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      subscriberName: '',
      relationship: ''
    },
    medicalHistory: {
      allergies: [],
      medications: [],
      conditions: [],
      surgeries: []
    },
    consents: {
      treatment: false,
      privacy: false,
      financial: false,
      communication: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const errors = validatePatientStep(step, patientData);
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitPatientData = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      const patient = await submitPatientOnboardingData(patientData);

      toast({
        title: "Patient Onboarding Complete",
        description: `Successfully created patient record for ${patientData.firstName} ${patientData.lastName}`,
      });

      onComplete(patient.id);
      
    } catch (error) {
      console.error('Error creating patient record:', error);
      toast({
        title: "Error",
        description: "Failed to complete patient onboarding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStepComplete = (stepData: any) => {
    setPatientData(prev => ({ ...prev, ...stepData }));
    nextStep();
  };

  const handleStepSkip = () => {
    nextStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformationStep patientData={patientData} setPatientData={setPatientData} />;
      case 2:
        return <AddressEmergencyStep patientData={patientData} setPatientData={setPatientData} />;
      case 3:
        return (
          <InsuranceStep 
            initialData={patientData} 
            onComplete={handleStepComplete}
            onSkip={handleStepSkip}
          />
        );
      case 4:
        return (
          <MedicalHistoryStep 
            initialData={patientData} 
            onComplete={handleStepComplete}
            onSkip={handleStepSkip}
          />
        );
      case 5:
        return <ConsentStep patientData={patientData} setPatientData={setPatientData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              Patient Onboarding
            </CardTitle>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        
        <CardContent>
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-800">Please correct the following errors:</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {renderStep()}

          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button variant="ghost" onClick={onCancel} className="ml-2">
                Cancel
              </Button>
            </div>
            
            <div>
              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={submitPatientData} disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Onboarding'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
