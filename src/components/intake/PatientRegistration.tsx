
import React, { useState } from 'react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useFormSequence } from '@/hooks/useFormSequence';
import { PatientRegistrationWelcome } from './PatientRegistrationWelcome';
import { PatientRegistrationProcess } from './PatientRegistrationProcess';
import { PatientRegistrationComplete } from './PatientRegistrationComplete';

export const PatientRegistration: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { forms, loading } = useIntakeForms();
  const {
    currentFormIndex,
    completedForms,
    formSequence,
    currentForm,
    newPatientForm,
    pregnancyForm,
    menstrualForm,
    initializeFormSequence,
    handleFormCompletion,
    handleSkipForm,
    resetSequence
  } = useFormSequence();

  const handleStartIntake = () => {
    initializeFormSequence();
    setShowForm(true);
  };

  const handleFormSubmissionComplete = (submission: any) => {
    console.log('Form submitted successfully:', submission);
    const isComplete = handleFormCompletion(submission);
    
    if (isComplete) {
      setShowForm(false);
    }
  };

  const handleSkip = () => {
    const isComplete = handleSkipForm();
    if (isComplete) {
      setShowForm(false);
    }
  };

  const handleExit = () => {
    setShowForm(false);
    resetSequence();
  };

  const handleStartNew = () => {
    resetSequence();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // Show form process
  if (showForm && currentForm) {
    return (
      <PatientRegistrationProcess
        currentForm={currentForm}
        currentFormIndex={currentFormIndex}
        formSequence={formSequence}
        onSubmissionComplete={handleFormSubmissionComplete}
        onSkipForm={handleSkip}
        onExit={handleExit}
      />
    );
  }

  // Show completion screen if forms are completed
  if (completedForms.length > 0 && !showForm) {
    return (
      <PatientRegistrationComplete
        completedForms={completedForms}
        forms={forms}
        onStartNew={handleStartNew}
      />
    );
  }

  // Show welcome screen
  return (
    <PatientRegistrationWelcome
      newPatientForm={newPatientForm}
      pregnancyForm={pregnancyForm}
      menstrualForm={menstrualForm}
      forms={forms}
      onStartIntake={handleStartIntake}
    />
  );
};
