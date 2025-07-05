
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { PatientInfoStep } from './steps/PatientInfoStep';
import { MedicalHistoryStep } from './steps/MedicalHistoryStep';
import { InsuranceStep } from './steps/InsuranceStep';
import { SymptomAssessmentWrapper } from './SymptomAssessmentWrapper';
import { PhotoVerificationStep } from './steps/PhotoVerificationStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { AutomatedReminderService } from '@/services/automatedReminderService';
import { ProviderNotificationService } from '@/services/providerNotificationService';
import { PatientStatusService } from '@/services/patientStatusService';
import { User, Shield, Heart, Camera, CheckCircle, Calendar } from 'lucide-react';

export const CompleteIntakeFlow: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentTenant } = useCurrentTenant();
  
  // Get pre-filled data from URL params (from booking widget)
  const initialData = {
    appointmentType: searchParams.get('type') || '',
    appointmentDate: searchParams.get('date') || '',
    appointmentTime: searchParams.get('time') || '',
    firstName: searchParams.get('firstName') || '',
    lastName: searchParams.get('lastName') || '',
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
    source: searchParams.get('source') || ''
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Patient Info
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    dateOfBirth: '',
    gender: '',
    phone: initialData.phone,
    email: initialData.email,
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    
    // Medical History
    medicalHistory: [],
    medications: [],
    allergies: [],
    
    // Insurance
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      subscriberName: '',
      relationship: 'self'
    },
    
    // Symptom Assessment
    symptomAssessment: null,
    
    // Photo Verification
    photoId: null,
    
    // Appointment Details
    appointmentType: initialData.appointmentType,
    appointmentDate: initialData.appointmentDate,
    appointmentTime: initialData.appointmentTime,
    source: initialData.source
  });

  const [patientId, setPatientId] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const steps = [
    { 
      number: 1, 
      title: 'Personal Information', 
      icon: User,
      description: 'Basic contact and demographic information'
    },
    { 
      number: 2, 
      title: 'Medical History', 
      icon: Heart,
      description: 'Previous conditions, medications, and allergies'
    },
    { 
      number: 3, 
      title: 'Insurance', 
      icon: Shield,
      description: 'Insurance coverage and policy details'
    },
    { 
      number: 4, 
      title: 'Symptom Assessment', 
      icon: Heart,
      description: 'Current symptoms and concerns'
    },
    { 
      number: 5, 
      title: 'Photo Verification', 
      icon: Camera,
      description: 'Identity verification (optional)'
    },
    { 
      number: 6, 
      title: 'Confirmation', 
      icon: CheckCircle,
      description: 'Review and submit your information'
    }
  ];

  useEffect(() => {
    // Update progress in real-time
    if (patientId && appointmentId) {
      const progress = Math.round((currentStep / steps.length) * 100);
      PatientStatusService.updateIntakeProgress(
        patientId, 
        appointmentId, 
        steps[currentStep - 1]?.title || 'Unknown Step', 
        progress
      );
    }
  }, [currentStep, patientId, appointmentId]);

  const handleStepComplete = async (stepData: any) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);

    // Create patient record on first step if needed
    if (currentStep === 1 && !patientId) {
      await createPatientAndAppointment(updatedFormData);
    }

    // Update symptom assessment status
    if (currentStep === 4 && stepData.symptomAssessment) {
      if (patientId && appointmentId) {
        await PatientStatusService.updateSymptomAssessment(patientId, appointmentId, true);
      }
    }

    // Move to next step
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const createPatientAndAppointment = async (data: any) => {
    try {
      // Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          address_line1: data.address.line1,
          address_line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          zip_code: data.address.zipCode,
          emergency_contact_name: data.emergencyContact.name,
          emergency_contact_phone: data.emergencyContact.phone,
          emergency_contact_relationship: data.emergencyContact.relationship
        })
        .select()
        .single();

      if (patientError) {
        console.error('Error creating patient:', patientError);
        return;
      }

      setPatientId(patient.id);

      // Create appointment if we have appointment details
      if (data.appointmentDate && data.appointmentTime) {
        const { data: appointment, error: appointmentError } = await supabase
          .from('appointments')
          .insert({
            patient_id: patient.id,
            date: data.appointmentDate,
            time: data.appointmentTime,
            title: `${data.appointmentType} - ${data.firstName} ${data.lastName}`,
            appointment_type: data.appointmentType,
            status: 'pending',
            phone: data.phone,
            email: data.email,
            duration: 60, // Default 60 minutes
            provider: 'TBD' // Will be assigned later
          })
          .select()
          .single();

        if (appointmentError) {
          console.error('Error creating appointment:', appointmentError);
          return;
        }

        setAppointmentId(appointment.id);

        // Schedule automated reminders
        await AutomatedReminderService.scheduleAppointmentReminders(appointment.id);

        // Update appointment status
        await PatientStatusService.updateAppointmentStatus(
          patient.id,
          appointment.id,
          'intake_started',
          'Patient has started the intake process'
        );
      }
    } catch (error) {
      console.error('Error in createPatientAndAppointment:', error);
    }
  };

  const handleFinalSubmit = async (finalData: any) => {
    try {
      // First, get or create a default form to reference
      const { data: defaultForm, error: formError } = await supabase
        .from('intake_forms')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .single();

      let formId = defaultForm?.id;

      // If no form exists, create a default one
      if (!formId) {
        const { data: newForm, error: newFormError } = await supabase
          .from('intake_forms')
          .insert({
            title: 'Complete Patient Intake',
            description: 'Comprehensive patient intake form',
            form_fields: []
          })
          .select('id')
          .single();

        if (newFormError) {
          console.error('Error creating default form:', newFormError);
          return;
        }
        formId = newForm.id;
      }

      // Create intake submission record
      const submissionData = {
        form_id: formId,
        patient_id: patientId,
        submission_data: { ...formData, ...finalData },
        status: 'completed',
        ai_summary: generateAISummary({ ...formData, ...finalData }),
        priority_level: determinePriorityLevel({ ...formData, ...finalData })
      };

      const { data: submission, error: submissionError } = await supabase
        .from('intake_submissions')
        .insert(submissionData)
        .select()
        .single();

      if (submissionError) {
        console.error('Error creating intake submission:', submissionError);
        return;
      }

      // Update appointment status
      if (patientId && appointmentId) {
        await PatientStatusService.updateAppointmentStatus(
          patientId,
          appointmentId,
          'intake_completed',
          'Patient has completed the intake process'
        );

        // Notify provider that intake is completed
        await ProviderNotificationService.notifyIntakeCompleted(
          appointmentId,
          patientId,
          'provider-1' // In real app, get this from appointment data
        );

        // Send confirmation instructions to patient
        await AutomatedReminderService.scheduleReminder({
          appointmentId,
          patientId,
          recipientEmail: formData.email,
          recipientPhone: formData.phone,
          reminderType: 'instructions',
          hoursBeforeAppointment: 0
        });
      }

      // Navigate to confirmation page
      setCurrentStep(steps.length);
    } catch (error) {
      console.error('Error in handleFinalSubmit:', error);
    }
  };

  const generateAISummary = (data: any) => {
    // Simple summary generation - in real app this would use AI
    const parts = [];
    
    if (data.symptomAssessment?.primaryComplaint) {
      parts.push(`Chief Complaint: ${data.symptomAssessment.primaryComplaint}`);
    }
    
    if (data.symptomAssessment?.painLevel) {
      parts.push(`Pain Level: ${data.symptomAssessment.painLevel}/10`);
    }
    
    if (data.medicalHistory?.length > 0) {
      parts.push(`Medical History: ${data.medicalHistory.length} conditions`);
    }
    
    if (data.medications?.length > 0) {
      parts.push(`Current Medications: ${data.medications.length}`);
    }
    
    return parts.join(' | ') || 'Standard intake completed';
  };

  const determinePriorityLevel = (data: any) => {
    // Simple priority determination
    if (data.symptomAssessment?.painLevel >= 8) return 'high';
    if (data.symptomAssessment?.painLevel >= 5) return 'medium';
    return 'normal';
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientInfoStep
            initialData={formData}
            onComplete={handleStepComplete}
          />
        );
      case 2:
        return (
          <MedicalHistoryStep
            initialData={formData}
            onComplete={handleStepComplete}
            onSkip={() => handleStepComplete({})}
          />
        );
      case 3:
        return (
          <InsuranceStep
            initialData={formData}
            onComplete={handleStepComplete}
            onSkip={() => handleStepComplete({})}
          />
        );
      case 4:
        return (
          <SymptomAssessmentWrapper
            onComplete={(data) => handleStepComplete({ symptomAssessment: data })}
            onSkip={() => handleStepComplete({})}
          />
        );
      case 5:
        return (
          <PhotoVerificationStep
            onComplete={(data) => handleStepComplete({ photoId: data })}
            onSkip={() => handleStepComplete({})}
          />
        );
      case 6:
        return (
          <ConfirmationStep
            formData={formData}
            onSubmit={handleFinalSubmit}
            onBack={() => setCurrentStep(currentStep - 1)}
          />
        );
      default:
        return null;
    }
  };

  const progress = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentTenant?.brand_name || 'HealthCare'} Intake
              </h1>
              <p className="text-gray-600">Complete your pre-visit information</p>
            </div>
          </div>
          
          {formData.appointmentDate && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3 max-w-md mx-auto">
              <Calendar className="w-4 h-4" />
              <span>
                Appointment: {formData.appointmentType} on {formData.appointmentDate} at {formData.appointmentTime}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </h2>
              <Badge variant="outline">{progress}% Complete</Badge>
            </div>
            
            <Progress value={progress} className="mb-4" />
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                
                return (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center text-center p-2 rounded-lg transition-colors ${
                      isCompleted
                        ? 'bg-green-100 text-green-800'
                        : isCurrent
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1]?.icon || User, { className: "w-5 h-5" })}
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
          </CardHeader>
          <CardContent>
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>🔒 Your information is secure and HIPAA compliant</p>
          <p className="mt-1">Questions? Call us at (555) 123-4567</p>
        </div>
      </div>
    </div>
  );
};
