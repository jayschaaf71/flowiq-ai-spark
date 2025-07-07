import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { VoiceRecorder } from './VoiceRecorder';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Mic, 
  MessageSquare, 
  User, 
  Heart, 
  Shield, 
  Sparkles,
  CheckCircle,
  Edit,
  Send,
  Bot
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

export const ConversationalVoiceIntake: React.FC = () => {
  const [conversation, setConversation] = useState<Array<{
    type: 'bot' | 'user';
    message: string;
    timestamp: Date;
  }>>([
    {
      type: 'bot',
      message: "Hi! I'm your AI intake assistant. I'll help you complete your patient information quickly and easily. You can tell me everything at once, or we can have a conversation. What would you like to share first?",
      timestamp: new Date()
    }
  ]);
  
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const allFormFields: FormField[] = [
    // Personal Information
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
    { name: 'gender', label: 'Gender', type: 'select', required: true },
    { name: 'phone', label: 'Phone Number', type: 'phone', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    
    // Address
    { name: 'address', label: 'Street Address', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
    
    // Emergency Contact
    { name: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', required: true },
    { name: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'phone', required: true },
    { name: 'emergencyContactRelationship', label: 'Emergency Contact Relationship', type: 'text', required: true },
    
    // Medical History
    { name: 'medicalConditions', label: 'Current Medical Conditions', type: 'textarea' },
    { name: 'medications', label: 'Current Medications', type: 'textarea' },
    { name: 'allergies', label: 'Allergies', type: 'textarea' },
    { name: 'surgeries', label: 'Previous Surgeries', type: 'textarea' },
    
    // Insurance
    { name: 'insuranceProvider', label: 'Insurance Provider', type: 'text', required: true },
    { name: 'policyNumber', label: 'Policy Number', type: 'text', required: true },
    { name: 'subscriberName', label: 'Subscriber Name', type: 'text', required: true },
    
    // Current Visit
    { name: 'chiefComplaint', label: 'Primary Reason for Visit', type: 'textarea', required: true },
    { name: 'symptomDuration', label: 'Symptom Duration', type: 'text' },
    { name: 'painLevel', label: 'Pain Level (0-10)', type: 'text' },
    { name: 'additionalSymptoms', label: 'Other Symptoms', type: 'textarea' }
  ];

  const handleVoiceTranscription = async (transcript: string, confidence: number) => {
    console.log('Processing conversational transcript:', transcript);
    
    // Add user message to conversation
    setConversation(prev => [...prev, {
      type: 'user',
      message: transcript,
      timestamp: new Date()
    }]);
    
    setIsProcessing(true);
    
    try {
      // Process with AI to extract data and generate response
      const { data, error } = await supabase.functions.invoke('ai-form-processor', {
        body: {
          transcript,
          formFields: allFormFields,
          currentFormData: extractedData,
          conversationMode: true,
          conversationHistory: conversation
        }
      });
      
      if (error) {
        console.error('AI processing error:', error);
        throw new Error(error.message);
      }
      
      if (data?.extractedData) {
        // Update extracted data
        setExtractedData(prev => ({ ...prev, ...data.extractedData }));
        
        // Generate follow-up question or completion message
        const botResponse = generateBotResponse(data.extractedData, data.completionSuggestions);
        
        setConversation(prev => [...prev, {
          type: 'bot',
          message: botResponse,
          timestamp: new Date()
        }]);
        
        // Check if we have enough information to complete
        const completionPercentage = calculateCompletionPercentage(data.extractedData);
        if (completionPercentage >= 80) {
          setIsComplete(true);
        }
      }
      
    } catch (err) {
      console.error('Error processing conversation:', err);
      
      const errorResponse = "I'm sorry, I had trouble processing that. Could you please try again?";
      setConversation(prev => [...prev, {
        type: 'bot',
        message: errorResponse,
        timestamp: new Date()
      }]);
      
      toast({
        title: "Processing Error",
        description: "There was an issue processing your response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateBotResponse = (currentData: Record<string, string>, suggestions?: string[]) => {
    const missingRequired = allFormFields
      .filter(field => field.required && !currentData[field.name])
      .map(field => field.label);
    
    if (missingRequired.length === 0) {
      return "Perfect! I have all the required information. You can review and submit your intake, or provide any additional details you'd like to share.";
    }
    
    if (missingRequired.length <= 3) {
      return `Great! I just need a few more details: ${missingRequired.join(', ')}. You can tell me all of these at once.`;
    }
    
    // Categorize missing fields for better prompting
    const personalInfo = ['First Name', 'Last Name', 'Date of Birth', 'Phone Number', 'Email Address'];
    const addressInfo = ['Street Address', 'City', 'State', 'ZIP Code'];
    const emergencyInfo = ['Emergency Contact Name', 'Emergency Contact Phone', 'Emergency Contact Relationship'];
    const insuranceInfo = ['Insurance Provider', 'Policy Number', 'Subscriber Name'];
    const medicalInfo = ['Primary Reason for Visit'];
    
    const missingPersonal = missingRequired.filter(field => personalInfo.includes(field));
    const missingAddress = missingRequired.filter(field => addressInfo.includes(field));
    const missingEmergency = missingRequired.filter(field => emergencyInfo.includes(field));
    const missingInsurance = missingRequired.filter(field => insuranceInfo.includes(field));
    const missingMedical = missingRequired.filter(field => medicalInfo.includes(field));
    
    if (missingPersonal.length > 0) {
      return `Thank you! Next, I need your basic personal information: ${missingPersonal.join(', ')}. You can tell me all of this at once.`;
    }
    
    if (missingAddress.length > 0) {
      return `Great! Now I need your address information: ${missingAddress.join(', ')}.`;
    }
    
    if (missingEmergency.length > 0) {
      return `Perfect! I need your emergency contact details: ${missingEmergency.join(', ')}.`;
    }
    
    if (missingInsurance.length > 0) {
      return `Excellent! Now for your insurance information: ${missingInsurance.join(', ')}.`;
    }
    
    if (missingMedical.length > 0) {
      return `Almost done! Finally, I need to know: ${missingMedical.join(', ')}.`;
    }
    
    return `I have most of your information. I still need: ${missingRequired.slice(0, 3).join(', ')}${missingRequired.length > 3 ? ` and ${missingRequired.length - 3} more items` : ''}.`;
  };

  const calculateCompletionPercentage = (data: Record<string, string>) => {
    const requiredFields = allFormFields.filter(field => field.required);
    const completedRequired = requiredFields.filter(field => data[field.name]?.trim()).length;
    return Math.round((completedRequired / requiredFields.length) * 100);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: extractedData.firstName,
          last_name: extractedData.lastName,
          date_of_birth: extractedData.dateOfBirth,
          gender: extractedData.gender,
          phone: extractedData.phone,
          email: extractedData.email,
          address_line1: extractedData.address,
          city: extractedData.city,
          state: extractedData.state,
          zip_code: extractedData.zipCode,
          emergency_contact_name: extractedData.emergencyContactName,
          emergency_contact_phone: extractedData.emergencyContactPhone,
          emergency_contact_relationship: extractedData.emergencyContactRelationship,
          insurance_provider: extractedData.insuranceProvider,
          insurance_policy_number: extractedData.policyNumber,
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
          form_id: 'conversational-voice-intake',
          patient_id: patient.id,
          patient_name: `${extractedData.firstName} ${extractedData.lastName}`,
          patient_email: extractedData.email,
          patient_phone: extractedData.phone,
          form_data: extractedData,
          status: 'completed',
          ai_summary: generateAISummary(),
          priority_level: determinePriorityLevel()
        })
        .select()
        .single();

      if (submissionError) {
        throw new Error(`Failed to create submission: ${submissionError.message}`);
      }

      toast({
        title: "Intake Complete!",
        description: "Your information has been successfully submitted.",
      });
      
      setConversation(prev => [...prev, {
        type: 'bot',
        message: `Perfect! Your intake is complete. Patient ID: ${patient.id}. We'll contact you soon to schedule your appointment.`,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAISummary = () => {
    const parts = [];
    
    if (extractedData.chiefComplaint) {
      parts.push(`Chief Complaint: ${extractedData.chiefComplaint}`);
    }
    
    if (extractedData.painLevel) {
      parts.push(`Pain Level: ${extractedData.painLevel}/10`);
    }
    
    if (extractedData.medicalConditions) {
      parts.push(`Medical Conditions: ${extractedData.medicalConditions}`);
    }
    
    return parts.join(' | ') || 'Conversational voice intake completed';
  };

  const determinePriorityLevel = () => {
    const painLevel = parseInt(extractedData.painLevel || '0');
    if (painLevel >= 8) return 'high';
    if (painLevel >= 5) return 'medium';
    return 'normal';
  };

  const completionPercentage = calculateCompletionPercentage(extractedData);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl">Conversational Intake</div>
              <div className="text-sm text-muted-foreground font-normal">
                Tell me everything at once, and I'll organize it for you
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={completionPercentage} className="flex-1" />
            <Badge variant={completionPercentage >= 80 ? "default" : "outline"}>
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-600" />
                    )}
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Input */}
          <VoiceRecorder
            onTranscriptionComplete={handleVoiceTranscription}
            placeholder="Tell me about yourself and why you're here today"
            maxDuration={180}
            isDisabled={isProcessing}
          />
        </CardContent>
      </Card>

      {/* Extracted Data Preview */}
      {Object.keys(extractedData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Extracted Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(extractedData).map(([key, value]) => {
                const field = allFormFields.find(f => f.name === key);
                if (!field || !value) return null;
                
                return (
                  <div key={key} className="p-3 border rounded-lg">
                    <div className="font-medium text-sm text-gray-700">{field.label}</div>
                    <div className="text-sm">{value}</div>
                  </div>
                );
              })}
            </div>
            
            {completionPercentage >= 80 && (
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Intake
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};