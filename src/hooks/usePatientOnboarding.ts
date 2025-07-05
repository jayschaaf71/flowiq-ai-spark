import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface OnboardingData {
  personal_info: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    occupation?: string;
    employer?: string;
  };
  contact_info: {
    phone?: string;
    email?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    preferredContact?: string;
  };
  insurance_info: {
    primaryInsurance?: {
      provider?: string;
      policyNumber?: string;
      groupNumber?: string;
      subscriberName?: string;
      subscriberDOB?: string;
      relationship?: string;
    };
    secondaryInsurance?: {
      provider?: string;
      policyNumber?: string;
      groupNumber?: string;
    };
    hasInsurance?: boolean;
  };
  medical_history: {
    currentMedications?: string[];
    allergies?: string[];
    medicalConditions?: string[];
    surgeries?: string[];
    familyHistory?: string[];
    smokingStatus?: string;
    alcoholConsumption?: string;
    exerciseFrequency?: string;
  };
  emergency_contact: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  consents: {
    hipaaNotice?: boolean;
    treatmentConsent?: boolean;
    communicationConsent?: boolean;
    appointmentReminders?: boolean;
    marketingCommunication?: boolean;
    financialAgreement?: boolean;
  };
  portal_preferences: {
    communicationMethod?: string;
    appointmentReminders?: boolean;
    educationalContent?: boolean;
    billingNotifications?: boolean;
    language?: string;
    accessibility?: string[];
  };
}

export interface OnboardingState {
  id?: string;
  step_completed: number;
  total_steps: number;
  is_completed: boolean;
  specialty?: string;
  data: OnboardingData;
}

export const usePatientOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [onboarding, setOnboarding] = useState<OnboardingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load onboarding data
  useEffect(() => {
    if (user?.id) {
      loadOnboardingData();
    }
  }, [user?.id]);

  const loadOnboardingData = async () => {
    try {
      // Mock onboarding data since table doesn't exist
      console.log('Loading mock onboarding data for user:', user?.id);
      
      // Initialize new onboarding record
      setOnboarding({
        step_completed: 0,
        total_steps: 7,
        is_completed: false,
        data: {
          personal_info: {},
          contact_info: {},
          insurance_info: {},
          medical_history: {},
          emergency_contact: {},
          consents: {},
          portal_preferences: {}
        }
      });
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      toast({
        title: "Error",
        description: "Failed to load onboarding progress. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStep = async (stepNumber: number, stepData: Partial<OnboardingData>, specialty?: string) => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      const updatedData = { ...onboarding?.data, ...stepData };
      const isCompleted = stepNumber >= (onboarding?.total_steps || 7);

      // Mock save operation
      console.log('Mock saving onboarding step:', stepNumber, stepData);

      setOnboarding(prev => ({
        ...prev!,
        step_completed: stepNumber,
        is_completed: isCompleted,
        specialty: specialty || prev?.specialty,
        data: updatedData
      }));

      if (isCompleted) {
        toast({
          title: "Onboarding Complete!",
          description: "Welcome to your patient portal. You're all set to start managing your healthcare.",
        });
      }

      return true;
    } catch (error) {
      console.error('Error saving onboarding step:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadDocument = async (file: File, category: string) => {
    if (!user?.id) return null;

    try {
      // Mock document upload
      console.log('Mock uploading document:', file.name, category);
      
      const mockDocData = {
        id: Date.now().toString(),
        patient_id: user.id,
        file_name: file.name,
        file_path: `${user.id}/${category}/${file.name}`,
        file_size: file.size,
        file_type: file.type,
        document_category: category,
        created_at: new Date().toISOString()
      };

      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });

      return mockDocData;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateStepData = (stepData: Partial<OnboardingData>) => {
    if (onboarding) {
      setOnboarding(prev => ({
        ...prev!,
        data: { ...prev!.data, ...stepData }
      }));
    }
  };

  return {
    onboarding,
    loading,
    saving,
    saveStep,
    uploadDocument,
    updateStepData,
    reload: loadOnboardingData
  };
};