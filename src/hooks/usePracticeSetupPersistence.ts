import { useEffect, useCallback, useRef } from 'react';
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
  setCurrentStep: (step: number) => void,
  onDataLoaded?: () => void
) => {
  const { user } = useAuth();
  const hasLoadedRef = useRef(false);
  
  // Get user-specific storage keys
  const storageKey = getStorageKey(user?.id, 'data');
  const stepStorageKey = getStorageKey(user?.id, 'step');

  // Load data from localStorage on mount - ONLY ONCE
  useEffect(() => {
    if (!storageKey || !stepStorageKey || !user?.id || hasLoadedRef.current) return;
    
    console.log('Loading saved practice setup data for user:', user.id);
    const savedData = localStorage.getItem(storageKey);
    const savedStep = localStorage.getItem(stepStorageKey);
    
    console.log('Saved data:', savedData);
    console.log('Saved step:', savedStep);
    
    let dataRestored = false;
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SetupData;
        // Only restore if it's not the default empty state
        if (parsedData.practiceType || parsedData.practiceName || parsedData.address) {
          console.log('Restoring setup data:', parsedData);
          setSetupData(parsedData);
          dataRestored = true;
        }
      } catch (error) {
        console.error('Failed to parse saved setup data:', error);
        if (storageKey) localStorage.removeItem(storageKey);
      }
    }
    
    if (savedStep) {
      try {
        const parsedStep = parseInt(savedStep, 10);
        if (parsedStep >= 1 && parsedStep <= 5) {
          console.log('Restoring step:', parsedStep);
          setCurrentStep(parsedStep);
        }
      } catch (error) {
        console.error('Failed to parse saved step:', error);
        if (stepStorageKey) localStorage.removeItem(stepStorageKey);
      }
    }
    
    hasLoadedRef.current = true;
    onDataLoaded?.();
    
    console.log('Data loading complete. Restored:', dataRestored);
  }, [storageKey, stepStorageKey, user?.id, setSetupData, setCurrentStep, onDataLoaded]);

  // Save data to localStorage whenever setupData changes - ONLY after initial load
  useEffect(() => {
    if (!storageKey || !hasLoadedRef.current) return;
    
    console.log('Saving setup data:', setupData);
    localStorage.setItem(storageKey, JSON.stringify(setupData));
  }, [setupData, storageKey]);

  // Save current step to localStorage whenever it changes - ONLY after initial load
  useEffect(() => {
    if (!stepStorageKey || !hasLoadedRef.current) return;
    
    console.log('Saving current step:', currentStep);
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
    
    hasLoadedRef.current = false;
  }, [storageKey, stepStorageKey]);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    if (!storageKey || !stepStorageKey) return false;
    const data = localStorage.getItem(storageKey);
    if (!data) return false;
    
    try {
      const parsedData = JSON.parse(data) as SetupData;
      // Only consider it "saved data" if it has meaningful content
      return !!(parsedData.practiceType || parsedData.practiceName || parsedData.address);
    } catch {
      return false;
    }
  }, [storageKey, stepStorageKey]);

  return {
    clearSavedData,
    hasSavedData
  };
};