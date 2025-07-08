import { useEffect, useCallback } from 'react';
import { SetupData } from '@/pages/PracticeSetup';
import { useAuth } from '@/contexts/AuthProvider';

// Make storage keys user-specific to prevent HIPAA violations
const getStorageKey = (userId: string | undefined, key: string) => {
  if (!userId) return null;
  return `practice-setup-${userId}-${key}`;
};

export const usePracticeSetupPersistence = (
  setupData: SetupData,
  setSetupData: (data: SetupData) => void,
  currentStep: number,
  setCurrentStep: (step: number) => void
) => {
  const { user } = useAuth();
  
  // Get user-specific storage keys
  const storageKey = getStorageKey(user?.id, 'data');
  const stepStorageKey = getStorageKey(user?.id, 'step');

  // Load data from localStorage on mount
  useEffect(() => {
    if (!storageKey || !stepStorageKey || !user?.id) return;
    
    console.log('Loading saved practice setup data for user:', user.id);
    const savedData = localStorage.getItem(storageKey);
    const savedStep = localStorage.getItem(stepStorageKey);
    
    console.log('Saved data:', savedData);
    console.log('Saved step:', savedStep);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SetupData;
        console.log('Restoring setup data:', parsedData);
        setSetupData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved setup data:', error);
        if (storageKey) localStorage.removeItem(storageKey);
      }
    }
    
    if (savedStep) {
      try {
        const parsedStep = parseInt(savedStep, 10);
        console.log('Restoring step:', parsedStep);
        if (parsedStep >= 1 && parsedStep <= 5) {
          setCurrentStep(parsedStep);
        }
      } catch (error) {
        console.error('Failed to parse saved step:', error);
        if (stepStorageKey) localStorage.removeItem(stepStorageKey);
      }
    }
  }, [storageKey, stepStorageKey, user?.id, setSetupData, setCurrentStep]);

  // Save data to localStorage whenever setupData changes
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(setupData));
  }, [setupData, storageKey]);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    if (!stepStorageKey) return;
    localStorage.setItem(stepStorageKey, currentStep.toString());
  }, [currentStep, stepStorageKey]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    if (!storageKey || !stepStorageKey) return;
    localStorage.removeItem(storageKey);
    localStorage.removeItem(stepStorageKey);
    
    // Also clear any legacy global keys to prevent data leakage
    localStorage.removeItem('practice-setup-data');
    localStorage.removeItem('practice-setup-step');
  }, [storageKey, stepStorageKey]);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    if (!storageKey || !stepStorageKey) return false;
    return localStorage.getItem(storageKey) !== null || localStorage.getItem(stepStorageKey) !== null;
  }, [storageKey, stepStorageKey]);

  return {
    clearSavedData,
    hasSavedData
  };
};