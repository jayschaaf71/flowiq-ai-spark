
import React, { useState } from 'react';
import { useIntakeForms } from '@/hooks/useIntakeForms';
import { useFormSequence } from '@/hooks/useFormSequence';
import { PatientRegistrationWelcome } from './PatientRegistrationWelcome';
import { PatientRegistrationProcess } from './PatientRegistrationProcess';
import { PatientRegistrationComplete } from './PatientRegistrationComplete';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLoadingState } from '@/hooks/useLoadingState';

export const PatientRegistration: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { forms, loading } = useIntakeForms();
  const { handleError } = useErrorHandler();
  const { setLoading, isLoading } = useLoadingState(['submission', 'initialization']);

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

  const handleStartIntake = async () => {
    try {
      setLoading('initialization', true);
      await initializeFormSequence();
      setShowForm(true);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to start intake process'));
    } finally {
      setLoading('initialization', false);
    }
  };

  const handleFormSubmissionComplete = async (submission: any) => {
    try {
      setLoading('submission', true);
      const isComplete = await handleFormCompletion(submission);
      
      if (isComplete) {
        setShowForm(false);
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to submit form'));
    } finally {
      setLoading('submission', false);
    }
  };

  const handleSkip = async () => {
    try {
      const isComplete = await handleSkipForm();
      if (isComplete) {
        setShowForm(false);
      }
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to skip form'));
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
    return <LoadingSpinner text="Loading intake forms..." />;
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
        isSubmitting={isLoading('submission')}
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
      isInitializing={isLoading('initialization')}
    />
  );
};
