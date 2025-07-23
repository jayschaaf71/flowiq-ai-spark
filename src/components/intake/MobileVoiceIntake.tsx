import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VoiceRecorder } from './VoiceRecorder';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  User, 
  Heart, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MessageCircle
} from 'lucide-react';

interface ConversationMessage {
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
  fieldContext?: string;
}

export const MobileVoiceIntake: React.FC = () => {
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      type: 'ai',
      content: "Hi! I'm here to help you complete your patient intake. Let's start with your personal information. Can you tell me your full name?",
      timestamp: new Date()
    }
  ]);
  const [currentContext, setCurrentContext] = useState('personal_info');
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const contexts = {
    personal_info: { 
      title: 'Personal Information', 
      icon: User,
      fields: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone', 'email']
    },
    address: { 
      title: 'Address & Emergency Contact', 
      icon: Heart,
      fields: ['address', 'city', 'state', 'zipCode', 'emergencyContactName', 'emergencyContactPhone']
    },
    medical: { 
      title: 'Medical History', 
      icon: Heart,
      fields: ['medicalConditions', 'medications', 'allergies', 'surgeries']
    },
    insurance: { 
      title: 'Insurance', 
      icon: Shield,
      fields: ['insuranceProvider', 'policyNumber', 'subscriberName']
    },
    symptoms: { 
      title: 'Current Symptoms', 
      icon: Heart,
      fields: ['chiefComplaint', 'painLevel', 'symptomDuration']
    }
  };

  const getProgressPercentage = () => {
    const allFields = Object.values(contexts).flatMap(ctx => ctx.fields);
    const filledFields = allFields.filter(field => {
      const value = formData[field];
      return value && typeof value === 'string' && value.trim() !== '';
    }).length;
    return Math.round((filledFields / allFields.length) * 100);
  };

  const getCurrentContextInfo = () => contexts[currentContext as keyof typeof contexts];

  const handleVoiceTranscription = async (transcript: string, confidence: number) => {
    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage: ConversationMessage = {
      type: 'user',
      content: transcript,
      timestamp: new Date(),
      fieldContext: currentContext
    };
    setConversation(prev => [...prev, userMessage]);

    try {
      // Process with AI to extract structured data
      const { data: aiResult, error: aiError } = await supabase.functions.invoke('ai-form-processor', {
        body: {
          transcript,
          formFields: getCurrentContextInfo().fields.map(field => ({
            name: field,
            label: getFieldLabel(field),
            type: getFieldType(field),
            required: true
          })),
          currentFormData: formData,
          conversationContext: currentContext
        }
      });

      if (aiError) {
        throw new Error(aiError.message);
      }

      // Update form data with extracted information
      if (aiResult?.extractedData) {
        setFormData(prev => ({ ...prev, ...aiResult.extractedData }));
        
        // Create confirmation message
        const confirmationParts = Object.entries(aiResult.extractedData)
          .filter(([key, value]) => value)
          .map(([key, value]) => `${getFieldLabel(key)}: ${value}`);
          
        if (confirmationParts.length > 0) {
          const aiResponse: ConversationMessage = {
            type: 'ai',
            content: `Perfect! I've captured: ${confirmationParts.join(', ')}. ${getNextPrompt()}`,
            timestamp: new Date()
          };
          setConversation(prev => [...prev, aiResponse]);
        }
      }

      // Check if current context is complete and move to next
      const contextFields = getCurrentContextInfo().fields;
      const isContextComplete = contextFields.every(field => formData[field] || aiResult?.extractedData?.[field]);
      
      if (isContextComplete) {
        moveToNextContext();
      }

    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: "Processing Error",
        description: "I didn't quite catch that. Could you try again?",
        variant: "destructive"
      });
      
      const errorResponse: ConversationMessage = {
        type: 'ai',
        content: "I didn't quite catch that. Could you repeat what you said?",
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      emergencyContactName: 'Emergency Contact Name',
      emergencyContactPhone: 'Emergency Contact Phone',
      medicalConditions: 'Medical Conditions',
      medications: 'Current Medications',
      allergies: 'Allergies',
      surgeries: 'Previous Surgeries',
      insuranceProvider: 'Insurance Provider',
      policyNumber: 'Policy Number',
      subscriberName: 'Subscriber Name',
      chiefComplaint: 'Main Concern',
      painLevel: 'Pain Level',
      symptomDuration: 'Symptom Duration'
    };
    return labels[fieldName] || fieldName;
  };

  const getFieldType = (fieldName: string): string => {
    const types: Record<string, string> = {
      email: 'email',
      phone: 'phone',
      dateOfBirth: 'date',
      painLevel: 'select',
      gender: 'select'
    };
    return types[fieldName] || 'text';
  };

  const getNextPrompt = (): string => {
    const contextFields = getCurrentContextInfo().fields;
    const missingFields = contextFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      const nextField = missingFields[0];
      const prompts: Record<string, string> = {
        lastName: "What's your last name?",
        dateOfBirth: "What's your date of birth?",
        gender: "What's your gender?",
        phone: "What's your phone number?",
        email: "What's your email address?",
        address: "What's your street address?",
        city: "What city do you live in?",
        state: "What state?",
        zipCode: "What's your ZIP code?",
        emergencyContactName: "Who should we contact in case of emergency?",
        emergencyContactPhone: "What's their phone number?",
        medicalConditions: "Do you have any current medical conditions?",
        medications: "Are you taking any medications?",
        allergies: "Do you have any allergies?",
        surgeries: "Have you had any previous surgeries?",
        insuranceProvider: "What's your insurance provider?",
        policyNumber: "What's your policy number?",
        subscriberName: "Who is the subscriber on the insurance policy?",
        chiefComplaint: "What brings you in today? What's your main concern?",
        painLevel: "On a scale of 0 to 10, what's your current pain level?",
        symptomDuration: "How long have you been experiencing these symptoms?"
      };
      return prompts[nextField] || `Can you tell me about your ${getFieldLabel(nextField)}?`;
    }
    
    return "Great! Let's move on to the next section.";
  };

  const moveToNextContext = () => {
    const contextOrder = ['personal_info', 'address', 'medical', 'insurance', 'symptoms'];
    const currentIndex = contextOrder.indexOf(currentContext);
    
    if (currentIndex < contextOrder.length - 1) {
      const nextContext = contextOrder[currentIndex + 1];
      setCurrentContext(nextContext);
      
      const nextContextInfo = contexts[nextContext as keyof typeof contexts];
      const aiResponse: ConversationMessage = {
        type: 'ai',
        content: `Excellent! Now let's gather your ${nextContextInfo.title.toLowerCase()}. ${getNextPrompt()}`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiResponse]);
    } else {
      completeIntake();
    }
  };

  const completeIntake = async () => {
    setIsProcessing(true);
    
    try {
      // Create patient record with all collected data
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          patient_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email as string,
          phone: formData.phone as string,
          address: formData.address as string,
          emergency_contact_name: formData.emergencyContactName as string,
          emergency_contact_phone: formData.emergencyContactPhone as string
        })
        .select()
        .single();

      if (patientError) {
        throw new Error(`Failed to create patient: ${patientError.message}`);
      }

      // Create intake submission
      const { error: submissionError } = await supabase
        .from('intake_submissions')
        .insert({
          form_id: 'mobile-voice-intake',
          patient_id: patient.id,
          patient_name: `${formData.firstName} ${formData.lastName}`,
          patient_email: formData.email,
          patient_phone: formData.phone,
          form_data: formData,
          status: 'completed',
          ai_summary: `Voice intake completed for ${formData.firstName} ${formData.lastName}. Chief complaint: ${formData.chiefComplaint || 'Not specified'}`,
          priority_level: determinePriorityLevel()
        });

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      setIsComplete(true);
      
      const completionMessage: ConversationMessage = {
        type: 'ai',
        content: `Perfect! Your intake is now complete, ${formData.firstName}. We have all your information and will be ready for your visit. Thank you!`,
        timestamp: new Date()
      };
      setConversation(prev => [...prev, completionMessage]);

      toast({
        title: "Intake Complete!",
        description: "Your information has been successfully submitted.",
      });

    } catch (error) {
      console.error('Completion error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const determinePriorityLevel = () => {
    const painLevel = parseInt(String(formData.painLevel || '0'));
    if (painLevel >= 8) return 'high';
    if (painLevel >= 5) return 'medium';
    return 'normal';
  };

  const CurrentIcon = getCurrentContextInfo().icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">
                Voice Intake Assistant
              </h1>
              <p className="text-gray-600 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Just speak naturally
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <CurrentIcon className="w-4 h-4" />
                {getCurrentContextInfo().title}
              </h2>
              <Badge variant="outline">{getProgressPercentage()}% Complete</Badge>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Conversation */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto space-y-3">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : message.type === 'ai'
                      ? 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      : 'bg-yellow-50 text-yellow-800 text-center'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-sm animate-pulse">
                  <p className="text-sm text-gray-600">Processing your response...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Recorder */}
        {!isComplete && (
          <VoiceRecorder
            onTranscriptionComplete={handleVoiceTranscription}
            isDisabled={isProcessing}
            placeholder="Tap to speak your answer"
            maxDuration={60}
          />
        )}

        {/* Completion State */}
        {isComplete && (
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Intake Complete!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you, {String(formData.firstName)}! Your information has been successfully submitted.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Scheduling
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help */}
        <Alert className="mt-6 border-blue-200 bg-blue-50">
          <Mic className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Speak naturally! The AI will understand and organize your responses automatically.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};