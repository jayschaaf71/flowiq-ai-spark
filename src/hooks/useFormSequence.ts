
import { useState } from 'react';
import { useIntakeForms } from '@/hooks/useIntakeForms';

export const useFormSequence = () => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [completedForms, setCompletedForms] = useState<string[]>([]);
  const [patientGender, setPatientGender] = useState<string>('');
  const [formSequence, setFormSequence] = useState<string[]>([]);
  
  const { forms } = useIntakeForms();

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
  };

interface FormSubmission {
  form_data?: Record<string, unknown>;
  formData?: Record<string, unknown>;
}

  const handleFormCompletion = (submission: FormSubmission) => {
    const currentFormId = formSequence[currentFormIndex];
    setCompletedForms(prev => [...prev, currentFormId]);

    // Check if this was the new patient form and extract gender
    if (currentForm?.title.toLowerCase().includes('new patient')) {
      const gender = (submission.form_data?.gender || submission.formData?.gender) as string;
      setPatientGender(gender || '');
      
      // Add conditional forms based on gender
      if (gender && typeof gender === 'string' && gender.toLowerCase() === 'female') {
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
      return true; // Indicates completion
    }
    return false;
  };

  const handleSkipForm = () => {
    if (currentFormIndex < formSequence.length - 1) {
      setCurrentFormIndex(prev => prev + 1);
    } else {
      return true; // Indicates completion
    }
    return false;
  };

  const resetSequence = () => {
    setCompletedForms([]);
    setPatientGender('');
    setFormSequence([]);
    setCurrentFormIndex(0);
  };

  return {
    currentFormIndex,
    completedForms,
    patientGender,
    formSequence,
    currentForm,
    newPatientForm,
    pregnancyForm,
    menstrualForm,
    initializeFormSequence,
    handleFormCompletion,
    handleSkipForm,
    resetSequence
  };
};
