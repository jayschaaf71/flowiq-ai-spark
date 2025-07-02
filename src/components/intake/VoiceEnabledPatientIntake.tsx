import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoiceEnabledFormField } from './VoiceEnabledFormField';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Heart, 
  Shield, 
  Mic, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Clock
} from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'date';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string; }[];
}

interface StepData {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  fields: FormField[];
}

export const VoiceEnabledPatientIntake: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionData, setCompletionData] = useState<any>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const steps: StepData[] = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself using voice or text',
      icon: User,
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'John' },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Smith' },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, description: 'Say it like "March 15th 1990"' },
        { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
          { value: 'other', label: 'Other' },
          { value: 'prefer-not-to-say', label: 'Prefer not to say' }
        ]},
        { name: 'phone', label: 'Phone Number', type: 'phone', required: true, placeholder: '(555) 123-4567' },
        { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@example.com' }
      ]
    },
    {
      title: 'Address & Emergency Contact',
      description: 'Your address and emergency contact information',
      icon: Heart,
      fields: [
        { name: 'address', label: 'Street Address', type: 'text', required: true, placeholder: '123 Main Street' },
        { name: 'city', label: 'City', type: 'text', required: true, placeholder: 'New York' },
        { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'NY' },
        { name: 'zipCode', label: 'ZIP Code', type: 'text', required: true, placeholder: '10001' },
        { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', required: true, placeholder: 'Jane Smith' },
        { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'phone', required: true, placeholder: '(555) 987-6543' },
        { name: 'emergencyContactRelationship', label: 'Relationship', type: 'select', required: true, options: [
          { value: 'spouse', label: 'Spouse' },
          { value: 'parent', label: 'Parent' },
          { value: 'child', label: 'Child' },
          { value: 'sibling', label: 'Sibling' },
          { value: 'friend', label: 'Friend' },
          { value: 'other', label: 'Other' }
        ]}
      ]
    },
    {
      title: 'Medical History',
      description: 'Your medical background and current health status',
      icon: Heart,
      fields: [
        { 
          name: 'medicalConditions', 
          label: 'Current Medical Conditions', 
          type: 'textarea', 
          placeholder: 'List any ongoing medical conditions',
          description: 'You can say "I have diabetes and high blood pressure" or list them separately'
        },
        { 
          name: 'medications', 
          label: 'Current Medications', 
          type: 'textarea', 
          placeholder: 'List all medications you are currently taking',
          description: 'Include dosages if known, like "Metformin 500mg twice daily"'
        },
        { 
          name: 'allergies', 
          label: 'Allergies', 
          type: 'textarea', 
          placeholder: 'List any known allergies',
          description: 'Include food, drug, and environmental allergies'
        },
        { 
          name: 'surgeries', 
          label: 'Previous Surgeries', 
          type: 'textarea', 
          placeholder: 'List any previous surgeries and approximate dates',
          description: 'Say something like "Appendectomy in 2018, knee surgery in 2020"'
        }
      ]
    },
    {
      title: 'Insurance Information',
      description: 'Your insurance coverage details',
      icon: Shield,
      fields: [
        { name: 'insuranceProvider', label: 'Insurance Provider', type: 'text', required: true, placeholder: 'Blue Cross Blue Shield' },
        { name: 'policyNumber', label: 'Policy Number', type: 'text', required: true, placeholder: 'ABC123456789' },
        { name: 'groupNumber', label: 'Group Number', type: 'text', placeholder: 'GRP001' },
        { name: 'subscriberName', label: 'Subscriber Name', type: 'text', required: true, placeholder: 'John Smith' },
        { name: 'subscriberRelationship', label: 'Relationship to Subscriber', type: 'select', required: true, options: [
          { value: 'self', label: 'Self' },
          { value: 'spouse', label: 'Spouse' },
          { value: 'child', label: 'Child' },
          { value: 'other', label: 'Other' }
        ]}
      ]
    },
    {
      title: 'Current Symptoms & Concerns',
      description: 'Tell us about your current health concerns',
      icon: Heart,
      fields: [
        { 
          name: 'chiefComplaint', 
          label: 'Primary Reason for Visit', 
          type: 'textarea', 
          required: true,
          placeholder: 'Describe your main health concern',
          description: 'Speak naturally about what brought you here today'
        },
        { 
          name: 'symptomDuration', 
          label: 'How long have you had these symptoms?', 
          type: 'text', 
          placeholder: 'e.g., 2 weeks, 3 months',
          description: 'You can say "for about two weeks" or be more specific'
        },
        { 
          name: 'painLevel', 
          label: 'Pain Level (0-10)', 
          type: 'select',
          description: 'Rate your current pain from 0 (no pain) to 10 (worst pain)',
          options: Array.from({ length: 11 }, (_, i) => ({ 
            value: i.toString(), 
            label: `${i} ${i === 0 ? '(No pain)' : i === 10 ? '(Worst pain)' : ''}` 
          }))
        },
        { 
          name: 'additionalSymptoms', 
          label: 'Other Symptoms', 
          type: 'textarea', 
          placeholder: 'Any other symptoms you are experiencing',
          description: 'Describe any additional symptoms, even if they seem unrelated'
        }
      ]
    }
  ];

  const currentStepData = steps[currentStep];
  const totalSteps = steps.length;
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Calculate form completeness for current step
  const getStepCompleteness = () => {
    const requiredFields = currentStepData.fields.filter(field => field.required);
    const completedRequired = requiredFields.filter(field => formData[field.name]?.trim()).length;
    const optionalFields = currentStepData.fields.filter(field => !field.required);
    const completedOptional = optionalFields.filter(field => formData[field.name]?.trim()).length;
    
    if (requiredFields.length === 0) return 100;
    const requiredPercentage = (completedRequired / requiredFields.length) * 80;
    const optionalPercentage = optionalFields.length > 0 ? (completedOptional / optionalFields.length) * 20 : 20;
    
    return Math.round(requiredPercentage + optionalPercentage);
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const validateCurrentStep = () => {
    const requiredFields = currentStepData.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]?.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please complete: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // Process the form data with AI
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('ai-form-processor', {
        body: {
          transcript: 'Complete form submission',
          formFields: steps.flatMap(step => step.fields),
          currentFormData: formData
        }
      });

      if (aiError) {
        console.error('AI processing error:', aiError);
      }

      // Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_phone: formData.emergencyContactPhone,
          emergency_contact_relationship: formData.emergencyContactRelationship,
          insurance_provider: formData.insuranceProvider,
          insurance_policy_number: formData.policyNumber,
          insurance_group_number: formData.groupNumber,
          onboarding_completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (patientError) {
        throw new Error(`Failed to create patient record: ${patientError.message}`);
      }

      // Create intake submission
      const { data: submission, error: submissionError } = await supabase
        .from('intake_submissions')
        .insert({
          form_id: 'voice-enabled-intake',
          patient_id: patient.id,
          patient_name: `${formData.firstName} ${formData.lastName}`,
          patient_email: formData.email,
          patient_phone: formData.phone,
          form_data: formData,
          status: 'completed',
          ai_summary: generateAISummary(),
          priority_level: determinePriorityLevel()
        })
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      setCompletionData({ patient, submission });
      
      toast({
        title: "Intake Complete!",
        description: "Your information has been successfully submitted.",
      });

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAISummary = () => {
    const parts = [];
    
    if (formData.chiefComplaint) {
      parts.push(`Chief Complaint: ${formData.chiefComplaint}`);
    }
    
    if (formData.painLevel) {
      parts.push(`Pain Level: ${formData.painLevel}/10`);
    }
    
    if (formData.medicalConditions) {
      parts.push(`Medical Conditions: ${formData.medicalConditions}`);
    }
    
    return parts.join(' | ') || 'Voice-enabled intake completed';
  };

  const determinePriorityLevel = () => {
    const painLevel = parseInt(formData.painLevel || '0');
    if (painLevel >= 8) return 'high';
    if (painLevel >= 5) return 'medium';
    return 'normal';
  };

  if (completionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Intake Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you, {formData.firstName}! Your information has been successfully submitted.
            </p>
            <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
              <p><strong>Patient ID:</strong> {completionData.patient.id}</p>
              <p><strong>Submission ID:</strong> {completionData.submission.id}</p>
              <p><strong>Next Steps:</strong> We'll contact you soon to schedule your appointment.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                Voice-Enabled Patient Intake
              </h1>
              <p className="text-gray-600 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Speak or type your responses
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <currentStepData.icon className="w-5 h-5" />
                {currentStepData.title}
              </h2>
              <Badge variant="outline">{progressPercentage}% Complete</Badge>
            </div>
            
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
          </CardContent>
        </Card>

        {/* Current Step Completeness */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Step {getStepCompleteness()}% complete
            {getStepCompleteness() < 100 && ' • Fill in the remaining fields to continue'}
          </AlertDescription>
        </Alert>

        {/* Form Fields */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentStepData.icon className="w-5 h-5" />
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepData.fields.map((field) => (
              <VoiceEnabledFormField
                key={field.name}
                field={field}
                value={formData[field.name] || ''}
                onChange={(value) => handleFieldChange(field.name, value)}
                allFields={currentStepData.fields}
                allValues={formData}
              />
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting || getStepCompleteness() < 80}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : currentStep === totalSteps - 1 ? (
              'Complete Intake'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Mobile-specific helper */}
        {isMobile && (
          <Alert className="mt-6 border-green-200 bg-green-50">
            <Mic className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Tap the "Voice" button on any field to speak your answer. The AI will automatically format it correctly.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};