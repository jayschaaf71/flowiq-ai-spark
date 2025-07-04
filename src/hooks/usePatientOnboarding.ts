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
      const { data, error } = await supabase
        .from('patient_onboarding')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setOnboarding({
          id: data.id,
          step_completed: data.step_completed,
          total_steps: data.total_steps,
          is_completed: data.is_completed,
          specialty: data.specialty,
          data: {
            personal_info: (data.personal_info as any) || {},
            contact_info: (data.contact_info as any) || {},
            insurance_info: (data.insurance_info as any) || {},
            medical_history: (data.medical_history as any) || {},
            emergency_contact: (data.emergency_contact as any) || {},
            consents: (data.consents as any) || {},
            portal_preferences: (data.portal_preferences as any) || {}
          }
        });
      } else {
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
      }
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

      const onboardingRecord = {
        user_id: user.id,
        step_completed: stepNumber,
        total_steps: onboarding?.total_steps || 7,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        personal_info: updatedData.personal_info,
        contact_info: updatedData.contact_info,
        insurance_info: updatedData.insurance_info,
        medical_history: updatedData.medical_history,
        emergency_contact: updatedData.emergency_contact,
        consents: updatedData.consents,
        portal_preferences: updatedData.portal_preferences,
        specialty: specialty || onboarding?.specialty
      };

      const { data, error } = await supabase
        .from('patient_onboarding')
        .upsert(onboardingRecord, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setOnboarding({
        id: data.id,
        step_completed: data.step_completed,
        total_steps: data.total_steps,
        is_completed: data.is_completed,
        specialty: data.specialty,
        data: updatedData
      });

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${category}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patient-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record
      const { data: docData, error: docError } = await supabase
        .from('patient_documents')
        .insert({
          patient_id: user.id,
          file_name: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: file.type,
          document_category: category
        })
        .select()
        .single();

      if (docError) throw docError;

      return docData;
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